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
    var levelsUp = parseInt(attrs.lendsFocusUp);

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