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

  $scope.table = $routeParams.tableId;
  $scope.month = window.innerWidth > 1249;
  angular.element(window).bind('resize', function() {
    $scope.$apply(function() {
      $scope.month = window.innerWidth > 1249;
    });
  });

  if (Modernizr.localstorage) {
    lastTable = localStorage.setItem('lastTable', $scope.table);
  }

  var d = today();
  var day_in_millis = 86400000;
  var add_on_scroll = 21;

  $scope.begin = 0;
  $scope.today = d.getTime();
  $scope.pageSize = 100;
  $scope.pointer = -1;
  $scope.Modernizr = Modernizr;
  $scope.birdseye = false;
  $scope.drawer = false;
  
  $scope.updateExceptTouch = function(entry) {
    !Modernizr.touch && entry.update();
  };

  $scope.scrollToToday = function() {
    var box = todays_element.getBoundingClientRect();
    var top = box.top - window.innerHeight/2 + box.height/2;
    smoothScroll(document.body.scrollTop + top, 0.5);
  };

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

  $scope.back = function() {
    $scope.drawer = false;
  }

  $scope.solo = function(entry) {
    if ($scope.month) {
      $scope.drawer = true;
      document.querySelector('solo textarea').focus();
      $scope.entry = entry;
    }
    if (Modernizr.touch) {
      window.location = '#/'+$scope.table+'/'+entry._id.$oid;
    }
  };

  $scope.entries = Entry.query({}, function() {

    if ($scope.entries.length == 0) {
      initDatabase();
    }

    $scope.entries.sort(function(a, b) {
      return a.timestamp - b.timestamp;
    })

    angular.forEach($scope.entries, function(entry) {
      if (entry.timestamp == $scope.today) {
        $scope.todaysEntry = entry;
        $scope.selectedEntry = entry;
        $scope.firstEntry = -$scope.entries.indexOf($scope.todaysEntry);
        $scope.lastEntry = $scope.entries.length + $scope.firstEntry;
      }
    })
    
  });


  $scope.addTop = function() {

    angular.forEach(_.range($scope.firstEntry-add_on_scroll, $scope.firstEntry), function(j) {
      $scope.entries.unshift(makeEntry(j));
    });
    $scope.firstEntry -= add_on_scroll;

  };

  $scope.addBottom = function() {

    angular.forEach(_.range($scope.lastEntry, $scope.lastEntry+add_on_scroll), function(j) {
      $scope.entries.push(makeEntry(j));
    });

    $scope.lastEntry += add_on_scroll;
    $scope.begin += add_on_scroll;

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
    angular.forEach(_.range(0, 50), function(i) {
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
