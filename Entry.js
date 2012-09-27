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
      var entry = e.parentElement.parentElement.parentElement;
      var change = function() {
        span.textContent = area.value;
      };

      area.addEventListener('input', change, false);

      _.defer(change);

      e.classList.add('active');

      area.addEventListener('focus', function() {
        entry.classList.add('focus');
      });
      area.addEventListener('blur', function() {
        entry.classList.remove('focus');
      });

      area.addEventListener('mouseover', function() {
        entry.classList.add('hover');
      });
      area.addEventListener('mouseout', function() {
        entry.classList.remove('hover');
      });

      e.parentElement.addEventListener('click', function() {
        area.focus();
      });

      _.defer(function() {

        if (entry.classList.contains('today')) {
          var rect = entry.getBoundingClientRect();
          window.scrollTo(0, rect.top - window.innerHeight/2 + rect.height/2);
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

      angular.forEach(_.range(-5, 5), function(i) {
        
        var e = makeEntry(i);

        e.$save();
        $scope.entries.push(e);

      });

    }
    
  });

  var j = -5, k = 6;
  addEventListener('scroll', function(e) {

    if (document.body.scrollTop < 20) {

      $scope.$apply(function() {
        var e = makeEntry(j--);
        $scope.entries.push(e);
        window.scrollTo(0, 88);
      });

    } else if (document.body.scrollTop + window.innerHeight >= document.body.scrollHeight - 20) {

      $scope.$apply(function() {
        var e = makeEntry(k++);
        $scope.entries.push(e);
        window.scrollTo(0, document.body.scrollTop + window.innerHeight-88);
      });
    }

  }, false);

  function makeEntry(i) {

    var date = new Date();
    date.setDate(today.getDate()+i);

    var e = new Entry({
      
      time: Math.floor(date.getTime()/millis)*millis,

      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear(),
      ordinal: ordinal(this.date),
      text: '',
      offset: i,
      ribbon0: false,
      ribbon1: false,
      ribbon2: false,
      ribbon3: false,
      ribbon4: false,

    });

    return e;

  }


};

function ordinal(n) {
 var s = ['th','st','nd','rd'], v = n % 100;
 return s[(v-20)%10]||s[v]||s[0];
}