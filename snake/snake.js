(function ($, window) {
  'use strict';

  var JS_SNAKE = {};

  JS_SNAKE.game = (function () {
    var ctx;
    var snake;

    var frameInterval = 50;

    JS_SNAKE.size = {
      width : 500,
      height: 500,
      block : 10
    };
    var coord = {
      x : 0,
      y : 0
    };

    function init() {
      var $canvas = $('#js-snake');
      $canvas.attr('width', JS_SNAKE.size.width);
      $canvas.attr('height', JS_SNAKE.size.height);

      ctx = $canvas[0].getContext('2d');
      snake = JS_SNAKE.snake();

      loop();
    }

    function loop() {
      ctx.clearRect(0, 0, JS_SNAKE.size.width,JS_SNAKE.size.height);
      snake.advance();
      snake.draw(ctx);
      setTimeout(loop, frameInterval);
    }

    return {
      init: init
    };
  })();

  JS_SNAKE.snake = function (){
    var position = [];
    position.push([6, 4]);
    position.push([5, 4]);
    position.push([4, 4]);
    var direction = 'right';

    function drawBlock(ctx, pos) {
      var x = JS_SNAKE.size.block * pos[0];
      var y = JS_SNAKE.size.block * pos[1];
      ctx.fillRect(x, y, JS_SNAKE.size.block, JS_SNAKE.size.block);
    }

    function draw(ctx) {
      ctx.save();
      ctx.fillStyle = 'tomato';
      for (var i = 0; i < position.length; i++) {
        drawBlock(ctx, position[i]);
      }
      ctx.restore();
    }

    function advance() {
      var nextPosition = position[0].slice();
      nextPosition[0]++;
      position.unshift(nextPosition);
      position.pop();
    }

    return {
      draw: draw,
      advance: advance
    }
  };

  $(document).ready(function() {
    JS_SNAKE.game.init();
  });

})($, window);
