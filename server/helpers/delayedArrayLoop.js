'use strict';

/**
 *
 * Eftersom det kan bli rate limit och econn reset problem iaf vi callar alla apier med 20 datum
 * för snabbt finns denna helper så man kan lägga delay på varje steg i ett api call då man anropar flera
 *
 * @param array (den array du vill loopa)
 * @param callback
 * @param interval (ms mellanrum i varje loop steg
 */

module.exports = function (array, callback, interval) {
  var newLoopTimer = new LoopTimer(function (time) {
    var element = array.shift();
    callback(element, time - start);
    // array.push(element);
  }, interval);

  var start = newLoopTimer.start();
};

// Timer
function LoopTimer(render, interval) {
  var timeout;
  var lastTime;

  this.start = startLoop;
  this.stop = stopLoop;

  // Starta Loop
  function startLoop() {
    timeout = setTimeout(createLoop, 0);
    lastTime = Date.now();
    return lastTime;
  }

  // Stanna Loop
  function stopLoop() {
    clearTimeout(timeout);
    return lastTime;
  }

  // Här loopas det
  function createLoop() {
    var thisTime = Date.now();
    var loopTime = thisTime - lastTime;
    var delay = Math.max(interval - loopTime, 0);
    timeout = setTimeout(createLoop, delay);
    lastTime = thisTime + delay;
    render(thisTime);
  }
}
