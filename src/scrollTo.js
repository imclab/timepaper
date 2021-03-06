var smoothScroll = (function() {
  
  var prevLoop;
  if (Modernizr.touch) {
    return function(y) {
      window.scrollTo(document.body.scrollLeft, y);
    }
  }
  
  return function(y, easing) {


    
    cancelAnimationFrame(prevLoop)

    target = y;
    easing = easing || 0.1;

    function loop() {
      var left = document.body.scrollLeft;
      var cur = document.body.scrollTop;
      var delta = (target - cur);
      if (Math.abs(delta) > 3) {
        prevLoop = requestAnimationFrame(loop);
      } else { 
        window.scrollTo(left, target)
      }

      var top = cur + delta*easing;
      
      window.scrollTo(left, top)
    }

    loop();

    angular.element(window).bind('mousewheel', function() {
      cancelAnimationFrame(prevLoop);
    });

  }

})();

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());