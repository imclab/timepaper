angular.module('entry', ['mongolab']).config(function($routeProvider) {
  $routeProvider.
    when('', { controller: EntryCtrl, templateUrl: 'entry.html' }).
    otherwise({ redirectTo: '' });
});

function EntryCtrl($scope, Entry) {
  
  var d = today();
  $scope.today = d.getTime();
  $scope.entries = Entry.query({}, function() {


    if ($scope.entries.length == 0) {

      angular.forEach(_.range(-47, 50), function(i) {
        
        var e = makeEntry(i);
        e.$save();
        $scope.entries.push(e);

      });

    }
    
  });

  function makeEntry(i) {

    var date = today();
    date.setDate(d.getDate()+i);

    var e = new Entry({
      timestamp: date.getTime(),
      text: ''
    });

    return e;

  }

  function today() {
    var t = new Date();
    var tt = new Date(0);
    tt.setFullYear(t.getFullYear(), t.getMonth(), t.getDate());
    return tt;
  }


};
