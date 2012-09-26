angular.module('entry', ['mongolab']).config(function($routeProvider) {
  $routeProvider.
  when('/', { controller: EntryCtrl, templateUrl: 'entry.html' }).
  otherwise({ redirectTo: '/' });
});

angular.module('entry').directive('expandingArea', function() {

  return function($scope, element, attrs) {

    angular.forEach(element, function(e) {

      e.classList.add('expandingArea');

      var area = e.querySelector('textarea');
      var span = e.querySelector('span');
      var change = function() {
        span.textContent = area.value;
      };

      area.addEventListener('input', change, false);

      _.defer(change);

      e.classList.add('active');

      area.addEventListener('focus', function() {
        e.parentElement.classList.add('focus');
      });
      area.addEventListener('blur', function() {
        e.parentElement.classList.remove('focus');
      });

      _.defer(function() {

        if (e.parentElement.classList.contains('today')) {
          var rect = e.parentElement.getBoundingClientRect();
          window.scrollTo(0, rect.top - window.innerHeight/2 + rect.height);
        }
      })


    });
  }

});

function EntryCtrl($scope, Entry) {

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  var millis = 86400000;
  var today = new Date(Math.floor(Date.now()/millis)*millis);
  $scope.today = today.getTime();
  $scope.entries = Entry.query({}, function() {

    if ($scope.entries.length == 0) {

      angular.forEach(_.range(-20, 20), function(i) {
        
        var date = new Date();
        date.setDate(today.getDate()+i);

        console.log(i);;


        var e = new Entry({
          
          time: Math.floor(date.getTime()/millis)*millis,

          day: days[date.getDay()],
          date: date.getDate(),
          month: months[date.getMonth()],
          year: date.getFullYear(),
          ordinal: ordinal(this.date),
          text: ' ',
          offset: i

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