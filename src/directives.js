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

.filter('thisMonth', function() {
  return function(timestamp) {
    return new Date(timestamp).getMonth() == new Date().getMonth() &&
    new Date(timestamp).getYear() == new Date().getYear();
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

 .directive('startsFocused', function() {
  return function($scope, element, attrs) {
    var raw = element[0];
    if ($scope.$eval(attrs.startsFocused)) {
      setTimeout(function() {

        raw.focus();
        setPosition(raw.value.length);

      }, 200)
    }
    function setPosition(pos) {
      if (raw.setSelectionRange) {
        raw.setSelectionRange(pos, pos);
      } else if (raw.createTextRange) {
        var range = raw.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    }  
  }
})

 .directive('lendsFocusUp', function() {
  return function($scope, element, attrs) {

    var child = element;
    var raw = child[0];
    var levelsUp = +attrs.lendsFocusUp;

    while (levelsUp--)
      element = element.parent();

    child.bind('focus',     function() { element.addClass('focus'); });
    child.bind('blur',      function() { element.removeClass('focus'); });
    child.bind('mouseover', function() { element.addClass('hover'); });
    child.bind('mouseout',  function() { element.removeClass('hover'); });
    element.bind('click',   function() { raw.focus(); });

    if ($scope.$eval(attrs.startsFocused)) {
      element.addClass('focus');
    }

  }

})

 .directive('overflow', function() {
  return function($scope, element, attrs) {

    var child = element;
    var raw = child[0];
    var levelsUp = +attrs.overflow;

    while (levelsUp--)
      element = element.parent();

    var checkOverflow = function() {
      if (child.height() > element.height() - 20) {
        element.addClass('overflow');
      } else { 
        element.removeClass('overflow');
      }
    };

    child.bind('input', checkOverflow)
    angular.element(window).bind('resize', _.debounce(checkOverflow, 80))

    _.defer(checkOverflow);

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

    _.defer(change);
    area.bind('input', Modernizr.touch ? _.debounce(change, 1000) : change);
    Modernizr.touch && area.bind('blur', change);

  }

})

// Needs work.
.directive('maintainFocus', function() {

  return function($scope, element, attrs) {

    if (Modernizr.touch) return;

    var prevCentered;
    var timeout;
    var centerType = attrs.maintainFocus;

    angular.element(window).bind('resize', function() {

      var centeredElement = document.querySelector('entry.focus') || getCenteredElement(centerType)

      if (prevCentered) {
        var rect = prevCentered.getBoundingClientRect();
        var t = rect.top + document.body.scrollTop + rect.height/2 - window.innerHeight/2;
        smoothScroll(t, 1)  
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
    // if (Modernizr.touch) return;
    if ($scope.$eval(attrs.scrollToThis)) {
      _.defer(function() {
        var rect = element[0].getBoundingClientRect();
        window.scrollTo(0, rect.top - window.innerHeight/2 + rect.height/2);
      });
    }
  }
})

.directive('pointToThis', function() {
  return function($scope, element, attrs) {
    $scope.pointer = 0;
    if ($scope.$eval(attrs.pointToThis)) {
      var raw = element[0];
      var onScroll = function() {
        _.defer(function() {
          $scope.$apply(function() {
            $scope.pointTo(raw);  
          })
        });
      };
      angular.element(window).bind('scroll', onScroll);
      onScroll();
    }
  }
})

.directive('reachTop', function() {
  return function($scope, element, attrs) {
    // if (Modernizr.touch) return;
    angular.element(window).bind('scroll', function() {
      if (document.body.scrollTop < 250) {


        var center = getCenteredElement('entry');
        var rect = center.getBoundingClientRect();

        $scope.$apply(function() {
          $scope.$eval(attrs.reachTop);
        });

        var rect2 = center.getBoundingClientRect();
        window.scrollTo(0, rect2.top + document.body.scrollTop - rect.top);

      }
    });
  }
})
.directive('reachBottom', function() {
  return function($scope, element, attrs) {
    // if (Modernizr.touch) return;
    angular.element(window).bind('scroll', function() {
      if (document.body.scrollTop > document.body.scrollHeight - window.innerHeight - 200) {

        var center = getCenteredElement('entry');
        var rect = center.getBoundingClientRect();

        $scope.$apply(function() {
          $scope.$eval(attrs.reachBottom);
        });

        var rect2 = center.getBoundingClientRect();
        window.scrollTo(0, rect2.top + document.body.scrollTop - rect.top);

      }
    });
  }
})

.directive('touchChange', function() {
  return function($scope, element, attrs) {
    if (!Modernizr.touch) return;
    element.bind('blur', function() {
      $scope.$apply(function() {
        $scope.$eval(attrs.touchChange);
      });
    });
  }
})

.directive('focus', function() {
  return function($scope, element, attrs) {
    element.bind('focus', function() {
      $scope.$apply(function() {
        $scope.$eval(attrs.focus);
      });
    });
  }
})

.directive('onTouch', function() {
  return function($scope, element, attrs) {
    element.bind('touchstart', function() {
      $scope.$apply(function() {
        $scope.$eval(attrs.onTouch);
      });
    });
  }
});

function getCenteredElement(centerType) {

  centerType = centerType.toUpperCase();
  var centeredElement = document.elementFromPoint(window.innerWidth/2, window.innerHeight/2);

  // Possible that the center isn't over an entry ...
  while (centeredElement && centeredElement.nodeName != centerType) {
    centeredElement = centeredElement.parentElement;
  }

  return centeredElement;

}