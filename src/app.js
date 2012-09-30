angular.module('entry', ['mongolab']).config(function($routeProvider) {
  $routeProvider.
    when('/:tableId', { controller: EntryCtrl, templateUrl: 'entry.html' }).
    otherwise({ redirectTo: 'demo' });
});

function EntryCtrl($scope, $route, $routeParams, Entry) {
  
  console.log(Modernizr.touch, $routeParams.tableId)
  
  Entry = Entry($routeParams.tableId);

  var d = today();
  var day_in_millis = 86400000;
  var add_on_scroll = 84;

  $scope.today = d.getTime();
  $scope.pageSize = 100;

  $scope.updateExceptTouch = function(entry) {
    !Modernizr.touch && entry.update();
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
