angular.module('entry', ['mongolab']).
  config(function($routeProvider) {
    $routeProvider.
      when('/', { controller: EntryCtrl, templateUrl: 'entry.html' }).
      otherwise({ redirectTo: '/' });
  });
 
function EntryCtrl($scope, Entry) {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  $scope.entries = [];
  $scope.today = new Date();

  if ($scope.entries.length == 0) {

    _.each(_.range(-10, 10), function(i) {
      var date = new Date();
      date.setDate($scope.today.getDate()+i);
      var e = new Entry();
      e.dateObject = date;
      e.day = days[date.getDay()];
      e.date = date.getDate();
      e.month = months[date.getMonth()];
      e.year = date.getFullYear();
      e.ordinal = ordinal(this.date);
      e.text = '';
      $scope.entries.push(e);
      e.$update();
    });



    console.log('gotem');
  } else {
  }

};

function ordinal(n) {
   var s = ['th','st','nd','rd'], v = n % 100;
   return s[(v-20)%10]||s[v]||s[0];
}