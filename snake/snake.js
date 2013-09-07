(function ($, window) {
  'use strict';

  var SNAKE = {};

  SNAKE.equalCoordinates = function (coord1, coord2) {
    return coord1[0] === coord2[0] && coord1[1] === coord2[1];
  };

  SNAKE.checkCoordinateInArray = function (coord, arr) {
    var isInArray = false;
    $.each(arr, function (index, item) {
      if (SNAKE.equalCoordinates(coord, item)) {
        isInArray = true;
      }
    });
    return isInArray;
  };

  SNAKE.game = (function () {
    var ctx;
    var snake;
    var apple;
    var score;
    var border;
    var scoreAmount;

    var frameInterval = 100;

    SNAKE.size = {
      width : 300,
      height: 300,
      block : 20
    };
    SNAKE.size.widthInBlocks = SNAKE.size.width / SNAKE.size.block;
    SNAKE.size.heightInBlocks = SNAKE.size.height / SNAKE.size.block;

    function init() {
      var $canvas = $('#js-snake');
      $canvas.attr('width', SNAKE.size.width);
      $canvas.attr('height', SNAKE.size.height);

      // The context is used for drawing.
      ctx = $canvas[0].getContext('2d');
      snake = SNAKE.snake();
      apple = SNAKE.apple();
      score = SNAKE.score();
      border = SNAKE.border();

      scoreAmount = 0;

      command();
      loop();
    }

    function loop() {
      // Sets all pixels to black w/ 0 opacity.
      ctx.clearRect(0, 0, SNAKE.size.width,SNAKE.size.height);
      snake.advance(apple);
      snake.draw(ctx);
      apple.draw(ctx);
      score.draw(ctx, scoreAmount);
      border.draw(ctx);
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

      $(SNAKE).bind('appleEaten', function (evt, snakePosition) {
        apple.move(snakePosition);
        frameInterval *= 0.95;
        scoreAmount++;
      });
    }

    return {
      init: init
    };
  })();

  SNAKE.border = function () {
    function draw(ctx) {
      ctx.save();
      ctx.strokeStyle = 'gray';
      ctx.lineWidth = SNAKE.size.block / 4;
      ctx.lineCap = 'square';
      var offset = ctx.lineWidth / 2;
      var corners = [
        [offset, offset],
        [SNAKE.size.width - offset, offset],
        [SNAKE.size.width - offset, SNAKE.size.height - offset],
        [offset, SNAKE.size.height - offset]
      ];
      ctx.beginPath();
      ctx.moveTo(corners[3][0], corners[3][1]);
      $.each(corners, function (index, corner) {
        ctx.lineTo(corner[0], corner[1]);
      });
      ctx.stroke();
      ctx.restore();
    }

    return {
      draw: draw
    };
  };

  SNAKE.score = function () {
    function draw(ctx, score) {
      ctx.save();
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(score, SNAKE.size.width - 20, SNAKE.size.height - 20);
      ctx.restore();
    }

    return {
      draw: draw
    };
  };

  SNAKE.apple = function () {
    var position = [6, 6];

    function draw(ctx) {
      ctx.save();
      ctx.fillStyle = 'lime';
      ctx.beginPath();
      var radius = SNAKE.size.block / 2;
      var x = position[0] * SNAKE.size.block + radius;
      var y = position[1] * SNAKE.size.block + radius;
      // x, y, radius, startangle, endangle (radians), clockwise.
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
      ctx.restore();
    }

    function random(low, high) {
      return Math.floor(Math.random() * (high - low + 1) + low);
    }

    function getRandomPosition() {
      var x = random(1, SNAKE.size.widthInBlocks - 2);
      var y = random(1, SNAKE.size.heightInBlocks - 2);
      return [x, y];
    }

    function getPosition() {
      return position;
    }

    function move() {
      position = getRandomPosition();
    }

    return {
      draw: draw,
      getPosition: getPosition,
      move: move
    };
  };

  SNAKE.snake = function () {
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
      var x = SNAKE.size.block * pos[0];
      var y = SNAKE.size.block * pos[1];
      ctx.fillRect(x, y, SNAKE.size.block, SNAKE.size.block);
    }

    function draw(ctx) {
      ctx.save();
      ctx.fillStyle = 'tomato';
      for (var i = 0; i < position.length; i++) {
        drawBlock(ctx, position[i]);
      }
      ctx.restore();
    }

    function advance(apple) {
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
      if (isEatingApple(position[0], apple)) {
        $(SNAKE).trigger('appleEaten', [position]);
      }
      else {
        position.pop();
      }
    }

    function isEatingApple(head, apple) {
      return SNAKE.equalCoordinates(head, apple.getPosition());
    }

    return {
      draw: draw,
      advance: advance,
      setDirection : setDirection
    };
  };

  $(document).ready(function() {
    SNAKE.game.init();
  });

})($, window);
