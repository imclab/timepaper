var smoothScroll = (function() {
  
  var prevLoop;
  
  return function(y, easing) {
    
    cancelAnimationFrame(prevLoop)

    target = y;
    easing = easing || 0.2;

    function loop() {
      var cur = document.body.scrollTop;
      var delta = (target - cur);
      if (Math.abs(delta) > 1) {
        prevLoop = requestAnimationFrame(loop);
      }

      var top = cur + delta*easing;
      var left = document.body.scrollLeft;
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