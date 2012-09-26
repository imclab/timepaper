angular.module('entry', ['mongolab']).config(function($routeProvider) {
  $routeProvider.
    when('/', { controller: EntryCtrl, templateUrl: 'entry.html' }).
    otherwise({ redirectTo: '/' });
});

angular.module('entry').directive('keyUpdate', function() {
  return function($scope, element, attrs) {
    var el = element[0];
    el.addEventListener('keyup', function() {
      $scope.entry.text = el.innerHTML;
      $scope.entry.update(function() {
        console.log('done');
      })
    }, false);
  }
});

function EntryCtrl($scope, Entry) {

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  var millis = 86400000;
  $scope.today = new Date(Math.floor(Date.now()/millis)*millis);
  $scope.entries = Entry.query({}, function() {

    console.log($scope.entries.length);

    if ($scope.entries.length == 0) {

      _.each(_.range(-10, 10), function(i) {
        var date = new Date();
        date.setDate($scope.today.getDate()+i);
        var e = new Entry({
          index: Math.floor(date.getTime()/millis),
          day: days[date.getDay()],
          date: date.getDate(),
          month: months[date.getMonth()],
          year: date.getFullYear(),
          ordinal: ordinal(this.date),
          text: ' '
        });
        e.$save();
        $scope.entries.push(e);
      });

    }

  });

};

function ordinal(n) {
   var s = ['th','st','nd','rd'], v = n % 100;
   return s[(v-20)%10]||s[v]||s[0];
}