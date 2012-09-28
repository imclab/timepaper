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
     return s[(v-20)%10]||s[v]||s[0];
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
    while (levelsUp--) {
      element = element.parent();
    }
    child.bind('focus', function() {
      element.addClass('focus');
    });
    child.bind('blur', function() {
      element.removeClass('focus');
    });
    child.bind('mouseover', function() {
      element.addClass('hover');
    });
    child.bind('mouseout', function() {
      element.removeClass('hover');
    });
    element.bind('click', function() {
      area.focus();
    });
  }
})

.directive('onResize', function() {
  return function($scope, element, attrs) {
    $(window).bind('resize', function() {
      $scope.$apply(attrs.onResize);
    });
  }
})

.directive('onUserScroll', function() {
  return function($scope, element, attrs) {
    element.bind('scroll', function() {
      $scope.$apply(attrs.onUserScroll);
    });
  }
})

.directive('scrollTo', function() {
  return function($scope, element, attrs) {
    if ($scope.$eval(attrs.scrollTo)) {
      _.defer(function() {
        var rect = element[0].getBoundingClientRect();
        window.scrollTo(0, rect.top - window.innerHeight/2 + rect.height/2);
      });
    }
  }
})