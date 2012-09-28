angular.module('entry', ['mongolab']).config(function($routeProvider) {
  $routeProvider.
  when('', { controller: EntryCtrl, templateUrl: 'entry.html' }).
  otherwise({ redirectTo: '' });
});

function EntryCtrl($scope, Entry) {
  
  var millis = 86400000;
  var today = new Date(Math.floor(Date.now()/millis)*millis);
  $scope.today = today.getTime();

  $scope.entries = Entry.query({}, function() {
    $scope.entries.length = [];

    if ($scope.entries.length == 0) {

      angular.forEach(_.range(-39, 40), function(i) {
        
        var e = makeEntry(i);

        e.$save();
        $scope.entries.push(e);

      });

    }
    
  });

  var prevCentered;

  $scope.maintainFocus = function() {

    var centeredElement = document.elementFromPoint(window.innerWidth/2, window.innerHeight/2);

    // Possible that the center isn't over an entry ...
    while (centeredElement && centeredElement.nodeName != 'ENTRY') {
      centeredElement = centeredElement.parentElement;
    }

    if (prevCentered) {
      
      var rect = prevCentered.getBoundingClientRect();
      var t = rect.top + document.body.scrollTop + rect.height/2 - window.innerHeight/2;
      window.scrollTo(0, t)

    } else if (centeredElement) { 
      prevCentered = centeredElement;
    }

  }

  $scope.setFocus = function() {
    prevCentered = undefined;
  }

  function makeEntry(i) {

    var date = new Date();
    date.setDate(today.getDate()+i);

    var e = new Entry({
      
      timestamp: date.getTime(),
      text: ''

    });

    return e;

  }


};
