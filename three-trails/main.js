(function (THREE) {
  'use strict';

  var view = {
    w: window.innerWidth,
    h: window.innerHeight,
    center : {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }
  };

  var mouse = {
    x: 0,
    y: 0
  };

  init();

  function init() {

  }

  function loop() {
    window.requestAnimationFrame(loop);
  }

})(window.THREE);
