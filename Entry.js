angular.module('entry', ['mongolab']).
  config(function($routeProvider) {
    $routeProvider.
      when('/', { controller: EntryCtrl, templateUrl: 'entry.html' }).
      otherwise({ redirectTo: '/' });
  });
 
function EntryCtrl($scope, Entry) {
  
  $scope.entries = Entry.query();
  $scope.today = new Date();

  if ($scope.entries.length == 0) {

    _.each(_.range(-10, 10), function(i) {
      var d = new Date();
      d.setDate($scope.today.getDate()+i);
      var e = new Entry(d);
      $scope.entries.push(e);
    });

  }

};

function ordinal(n) {
   var s = ['th','st','nd','rd'], v = n % 100;
   return s[(v-20)%10]||s[v]||s[0];
}