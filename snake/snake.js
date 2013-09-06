(function ($, window) {
  'use strict';

  var JS_SNAKE = {};

  JS_SNAKE.game = (function () {
    var ctx;
    var snake;
    var apple;

    var frameInterval = 50;

    JS_SNAKE.size = {
      width : 500,
      height: 200,
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

      // The context is used for drawing.
      ctx = $canvas[0].getContext('2d');
      snake = JS_SNAKE.snake();
      apple = JS_SNAKE.apple();

      command();
      loop();
    }

    function loop() {
      // Sets all pixels to black w/ 0 opacity.
      ctx.clearRect(0, 0, JS_SNAKE.size.width,JS_SNAKE.size.height);
      snake.advance();
      snake.draw(ctx);
      apple.draw(ctx);
      setTimeout(loop, frameInterval);
    }

    function command() {
      var keysToDirections = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
      };

      $(document).keydown(function (evt) {
        var key = evt.which;
        var direction = keysToDirections[key];

        if (direction) {
          snake.setDirection(direction);
          evt.preventDefault();
        }
      });
    }

    return {
      init: init
    };
  })();

  JS_SNAKE.apple = function () {
    var position = [6, 6];

    function draw(ctx) {
      ctx.save();
      ctx.fillStyle = 'lime';
      ctx.beginPath();
      var radius = JS_SNAKE.size.block / 2;
      var x = position[0] * JS_SNAKE.size.block + radius;
      var y = position[1] * JS_SNAKE.size.block + radius;
      // x, y, radius, startangle, endangle (radians), clockwise.
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
      ctx.restore();
    }

    return {
      draw: draw
    };
  };

  JS_SNAKE.snake = function () {
    var position = [];
    position.push([6, 4]);
    position.push([5, 4]);
    position.push([4, 4]);
    var direction = 'right';
    var nextDirection = direction;

    function setDirection (newDirection) {
      var allowedDirections = {
        left:  ['up', 'down'],
        right: ['up', 'down'],
        up:    ['left', 'right'],
        down:  ['left', 'right'],
      };
      if (allowedDirections[direction].indexOf(newDirection) !== -1) {
        nextDirection = newDirection;
      }
      else {
        throw('Invalid direction');
      }
    }

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
      direction = nextDirection;

      switch (direction) {
        case 'left':
          nextPosition[0] -= 1;
          break;
        case 'up':
          nextPosition[1] -= 1;
          break;
        case 'right':
          nextPosition[0] += 1;
          break;
        case 'down':
          nextPosition[1] += 1;
          break;
        default:
          throw('Invalid direction');
      }

      position.unshift(nextPosition);
      position.pop();
    }

    return {
      draw: draw,
      advance: advance,
      setDirection : setDirection
    };
  };

  $(document).ready(function() {
    JS_SNAKE.game.init();
  });

})($, window);
