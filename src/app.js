angular.module('entry', ['mongolab']).config(function($routeProvider) {
  var table = 'demo';
  if (Modernizr.localstorage) {
    lastTable = localStorage.getItem('lastTable');
    if (lastTable) {
      table = lastTable;
    }
  }
  $routeProvider.
    when('/:tableId', { controller: EntryCtrl, templateUrl: 'templates/calendar.html' }).
    when('/:tableId/:entryId', { controller: EditCtrl, templateUrl: 'templates/solo.html' }).
    otherwise({ redirectTo: table });
});

function EntryCtrl($scope, $route, $routeParams, Entry) {
  
  Entry = Entry($routeParams.tableId);

  var d = today();
  var day_in_millis = 86400000;
  var add_on_scroll = 21;

  $scope.begin = 0;
  $scope.today = d.getTime();
  $scope.pageSize = 200;
  $scope.pointer = -1;
  $scope.Modernizr = Modernizr;
  $scope.birdseye = false;
  $scope.drawer = false;
  $scope.month = window.innerWidth > 1249;
  
  angular.element(window).bind('resize', function() {
    $scope.$apply(function() {
      $scope.month = window.innerWidth > 1249;
    });
  });

  if (Modernizr.localstorage) {
    localStorage.setItem('lastTable', $scope.table);
  }


  $scope.entries = Entry.query({}, function() {

    if ($scope.entries.length == 0) {
      initDatabase();
    }

    $scope.entries.sort(function(a, b) {
      return a.timestamp - b.timestamp;
    });

    angular.forEach($scope.entries, function(entry) {
      if (entry.timestamp == $scope.today) {
        $scope.todaysEntry = entry;
        
        $scope.firstEntry = -$scope.entries.indexOf($scope.todaysEntry);
        $scope.lastEntry = $scope.entries.length + $scope.firstEntry;
        if (!Modernizr.touch) $scope.solo(entry);
      }
    });
    
  });

  $scope.updateExceptTouch = function(entry) {
    !Modernizr.touch && entry.update();
  };

  $scope.back = function() {
    $scope.drawer = false;
    $scope.selectedEntry = undefined;
  }

  $scope.solo = function(entry) {
    if ($scope.month) {
      $scope.drawer = true;
      document.querySelector('solo textarea').focus();
      $scope.entry = entry;
      $scope.selectedEntry = entry;
    }
    if (Modernizr.touch) {
      window.location = '#/'+$routeParams.tableId+'/'+entry._id.$oid;
    }
  };

  $scope.addTop = function() {
    console.log('top');
    angular.forEach(_.range($scope.firstEntry-add_on_scroll, $scope.firstEntry), function(j) {
      $scope.entries.unshift(makeEntry(j));
    });
    $scope.firstEntry -= add_on_scroll;
  };

  $scope.addBottom = function() {
    console.log('bottom');
    angular.forEach(_.range($scope.lastEntry, $scope.lastEntry+add_on_scroll), function(j) {
      $scope.entries.push(makeEntry(j));
    });
    $scope.lastEntry += add_on_scroll;
    $scope.begin += add_on_scroll;
  };

  $scope.toggleBirdseye = function() {
      
    if ($scope.birdseye = !$scope.birdseye) {
      // $scope.pageSize = 400;
    } else { 
      // $scope.pageSize = 200;
    }
  };




  function makeEntry(i) {
    var date = today();
    date.setDate(d.getDate()+i);
    var e = new Entry({
      timestamp: date.getTime(),
      text: ''
    });
    return e;
  }

  function initDatabase() {
    angular.forEach(_.range(-50, 50), function(i) {
      var e = makeEntry(i);
      e.$save();
      $scope.entries.push(e);
    });
  }

  function today() {
    var t = new Date();
    var tt = new Date(0);
    tt.setFullYear(t.getFullYear(), t.getMonth(), t.getDate());
    return tt;
  }

  // todo move to directives somehow
  $scope.scrollToToday = function() {
    var box = todays_element.getBoundingClientRect();
    var top = box.top - window.innerHeight/2 + box.height/2;
    smoothScroll(document.body.scrollTop + top, 0.5);
  };

  // todo move to directives somehow
  var todays_element;
  $scope.pointTo = function(element) {
    todays_element = element;
    var box = element.getBoundingClientRect();
    var p = 0;
    if (box.bottom < 0) {
      p = -1;
    } else if (box.top > window.innerHeight) {
      p = 1;
    }
    $scope.pointer = p;
  };

};

function EditCtrl($scope, $location, $routeParams, Entry) {

  Entry = Entry($routeParams.tableId);
  Entry.get({id: $routeParams.entryId}, function(entry) {
    $scope.selectedEntry = entry;
  });

  $scope.back = function() {
    window.location = '#/'+$routeParams.tableId;
  };

}
