angular.module('entry', ['mongolab']).
  config(function($routeProvider) {
    $routeProvider.
      when('/', { controller: EntryCtrl, templateUrl: 'entry.html' }).
      otherwise({ redirectTo: '/' });
  });
 
function EntryCtrl($scope, Entry) {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  $scope.today = new Date();
  $scope.entries = Entry.query(function() {

    console.log($scope.entries.length);

    if ($scope.entries.length == 0) {

      _.each(_.range(-10, 10), function(i) {
        var date = new Date();
        date.setDate($scope.today.getDate()+i);
        var e = new Entry({
          // dateObject: date,
          day: days[date.getDay()],
          date: date.getDate(),
          month: months[date.getMonth()],
          year: date.getFullYear(),
          ordinal: ordinal(this.date),
          text: ' '
        });
        e.$update();
        $scope.entries.push(e);
      });

    }

  });

};

function ordinal(n) {
   var s = ['th','st','nd','rd'], v = n % 100;
   return s[(v-20)%10]||s[v]||s[0];
}