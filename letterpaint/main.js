(function () {
  'use strict';

  var letter = Math.random().toString(36).slice(-1);

  var c = document.getElementById('js-paint');
  var cx = c.getContext('2d');
  c.height = 480;
  c.width = 320;
  cx.lineWidth = 20;
  cx.lineCap = 'round';
  cx.strokeStyle = 'rgb(30, 30, 60)';
  cx.font = 'bold 350px helvetica';
  cx.fillStyle = 'rgb(255, 0, 0)';
  cx.textBaseline = 'middle';
  var center = {
    x: (c.width - cx.measureText(letter).width) / 2,
    y: c.height / 2
  };
  cx.fillText(letter, center.x, center.y);
  var mouseDown = false;
  var lastPosition = {
    x: null,
    y: null
  };

  function isOnCanvas(p) {
    return 0 < p.x && p.x <= c.width && 0 < p.y && p.y <= c.height;
  }

  function paint(x, y) {
    cx.beginPath();
    if (isOnCanvas(lastPosition)) {
      cx.moveTo(lastPosition.x, lastPosition.y);
    }
    cx.lineTo(x, y);
    cx.stroke();
    cx.closePath();
  }

  c.addEventListener('mouseup', function (e) {
    mouseDown = false;
    e.preventDefault();
  });
  c.addEventListener('mousedown', function (e) {
    mouseDown = true;
    e.preventDefault();
  });
  c.addEventListener('mousemove', function (e) {
    if (mouseDown) {
      paint(e.clientX, e.clientY);
    }
    lastPosition.x = e.clientX;
    lastPosition.y = e.clientY;
  });

// Prevents long trails when the mouse wanders outside of canvas.
  document.addEventListener('mousemove', function (e) {
    var position = {
      x: e.clientX,
      y: e.clientY
    };
    if (!isOnCanvas(position)) {
      lastPosition.x = null;
      lastPosition.y = null;
    }
  })
})();


