(function ($, window) {
  'use strict';

  var COUNTER = {};

  COUNTER.fps = (function () {
    var ctx;
    var framesPerSecond;
    var lastSecond;

    function init() {
      var $canvas = $('js-counter');
      $canvas.attr('width', $('html').outerWidth());
      framesPerSecond = 0;
      lastSecond = framesPerSecond;

      // The context is used for drawing.
      ctx = document.getElementById('js-counter').getContext('2d');

      setInterval(loop, 1);
      setInterval(reset, 1000);
    }

    function loop() {
      update();
      updateCounter();
      render();
    }

    function update() {

    }

    function render() {
      ctx.clearRect(0, 0, 50, 50);
      ctx.save();

      for (var i = 0; i < 50; i++) {
        for (var j = 0; j < 50; j++) {
          ctx.fillStyle = 'rgba(' + randomColor() + ', ' + randomColor() + ', ' + randomColor() + ', 1)';
          ctx.fillRect(i, j, 1, 1);
        }
      }

      ctx.restore();
      renderCounter();
    }

    function reset() {
      lastSecond = framesPerSecond;
      framesPerSecond = 0;
    }

    function updateCounter() {
      framesPerSecond++;
    }

    function renderCounter() {
      ctx.save();
      ctx.font = 'bold 30px mono';
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lastSecond, 25, 25);
      ctx.restore();
    }

    function randomColor() {
      return Math.floor(Math.random() * 255 + 1);
    }

    return {
      init: init
    };
  })();

  $(COUNTER.fps.init);

})($, window);
