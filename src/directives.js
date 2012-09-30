angular.module('entry')

.filter('day', function () {
  return function(timestamp) {
    var day = new Date(timestamp).getDay();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  }
})

.filter('month', function () {
  return function(timestamp) {
    var month = new Date(timestamp).getMonth();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
  }
})

.filter('year', function () {
  return function(timestamp) {
    return new Date(timestamp).getFullYear();
  }
})

.filter('ordinal', function () {
  return function(timestamp) {
     var s = ['th','st','nd','rd'], v = new Date(timestamp).getDate() % 100;
     return s[(v-20)%10] || s[v] || s[0];
  }
})

.filter('date', function () {
  return function(timestamp) {
     return new Date(timestamp).getDate();
  }
})

/* http://jsfiddle.net/2ZzZB/56/
 * We already have a limitTo filter built-in to angular,
 * let's make a startFrom filter */
.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
})

.directive('expandingArea', function() {

  return function($scope, element, attrs) {

    element.addClass('expandingArea');
    element.addClass('active');

    var area = element.find('textarea');
    var span = element.find('span');

    var change = function() {
      span.text(area.val());
    };

    area.bind('input', change);
    _.defer(change);

  }

})

.directive('lendsFocusUp', function() {
  return function($scope, element, attrs) {

    var child = element;
    var levelsUp = +attrs.lendsFocusUp;

    while (levelsUp--)
      element = element.parent();

    child.bind('focus',     function() { element.addClass('focus'); });
    child.bind('blur',      function() { element.removeClass('focus'); });
    child.bind('mouseover', function() { element.addClass('hover'); });
    child.bind('mouseout',  function() { element.removeClass('hover'); });
    element.bind('click',   function() { child[0].focus(); });

  }
})

// Needs work.
.directive('maintainFocus', function() {

  return function($scope, element, attrs) {

    if (Modernizr.touch) return;

    var prevCentered;
    var centerType = attrs.maintainFocus.toUpperCase();

    angular.element(window).bind('resize', function() {

      var centeredElement = document.elementFromPoint(window.innerWidth/2, window.innerHeight/2);

      // Possible that the center isn't over an entry ...
      while (centeredElement && centeredElement.nodeName != centerType) {
        centeredElement = centeredElement.parentElement;
      }

      if (prevCentered) {
        var rect = prevCentered.getBoundingClientRect();
        var t = rect.top + document.body.scrollTop + rect.height/2 - window.innerHeight/2;
        window.scrollTo(0, t)
      } else if (centeredElement) {
        prevCentered = centeredElement;
      }

    });

    angular.element(window).bind('mousewheel', function() {
      prevCentered = undefined;
    });

  }

})

.directive('scrollToThis', function() {
  return function($scope, element, attrs) {
    if ($scope.$eval(attrs.scrollToThis)) {
      _.defer(function() {
        var rect = element[0].getBoundingClientRect();
        window.scrollTo(0, rect.top - window.innerHeight/2 + rect.height/2);
      });
    }
  }
})

.directive('reachTop', function() {
  return function($scope, element, attrs) {
    angular.element(window).bind('scroll', function() {
      if (document.body.scrollTop < 200) {
        $scope.$apply(function() {
          $scope.$eval(attrs.reachTop);
        });
        window.scrollTo(0, 340*5.5);
      }
    });
  }
})
.directive('reachBottom', function() {
  return function($scope, element, attrs) {
    angular.element(window).bind('scroll', function() {
      if (document.body.scrollTop > document.body.scrollHeight - window.innerHeight - 200) {
        $scope.$apply(function() {
          $scope.$eval(attrs.reachBottom);
        });
        // window.scrollTo(0, document.body.scrollHeight - window.innerHeight - 340);
      }
    });
  }
})

.directive('touchChange', function() {
  return function($scope, element, attrs) {
    element.bind(Modernizr.touch ? 'blur' : 'keydown', function() {
      $scope.$apply(function() {
        $scope.$eval(attrs.touchChange);
      });
    });
  }
})