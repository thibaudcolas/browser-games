(function ($, window) {
  'use strict';

  var JS_SNAKE = {};

  JS_SNAKE.game = (function () {
    var ctx;
    var frameInterval = 50;
    var size = {
      width : 500,
      height: 500
    };
    var coord = {
      x : 0,
      y : 0
    };

    function init() {
      var $canvas = $('#js-snake');
      $canvas.attr('width', size.width);
      $canvas.attr('height', size.height);
      ctx = $canvas[0].getContext('2d');

      loop();
    };

    function loop() {
      coord.x += 2;
      coord.y += 4;
      ctx.clearRect(0, 0, 500, 500);
      ctx.fillStyle = '#fe57a1';
      ctx.fillRect(coord.x, coord.y, 30, 50);
      setTimeout(loop, frameInterval);
    }

    return {
      init : init
    }
  })();

  $(document).ready(function() {
    JS_SNAKE.game.init();
  });

})($, window);
