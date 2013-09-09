(function () {
  'use strict';

  var c = document.getElementById('js-paint');
  var cx = c.getContext('2d');
  c.height = 480;
  c.width = 320;
  cx.lineWidth = 20;
  cx.lineCap = 'round';
  cx.strokeStyle = 'rgb(30, 30, 60)';
  var mouseDown = false;
  var lastPosition = {
    x: null,
    y: null
  };

  function onMouseDown(e) {
    mouseDown = true;
    e.preventDefault();
  }

  function onMouseUp(e) {
    mouseDown = false;
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (mouseDown) {
      paint(e.clientX, e.clientY);
    }
    lastPosition.x = e.clientX;
    lastPosition.y = e.clientY;
  }

  function paint(x, y) {
    cx.beginPath();
    if (lastPosition.x > 0) {
      cx.moveTo(lastPosition.x, lastPosition.y);
    }
    cx.lineTo(x, y);
    cx.stroke();
    cx.closePath();
  }

  c.addEventListener('mouseup', onMouseUp);
  c.addEventListener('mousedown', onMouseDown);
  c.addEventListener('mousemove', onMouseMove);
})();
