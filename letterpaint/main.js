(function () {
  'use strict';

  var c = document.getElementById('js-paint');
  var cx = c.getContext('2d');
  c.height = 480;
  c.width = 320;
  cx.lineWidth = 20;
  cx.lineCap = 'round';
  cx.strokeStyle = 'rgb(30, 30, 60)';
  var mousedown = false;

  function onmousedown(e) {
    mousedown = true;
    e.preventDefault();
  }

  function onmouseup(e) {
    mousedown = false;
    e.preventDefault();
  }

  function onmousemove(e) {
    if (mousedown) paint(e.clientX, e.clientY);
  }

  function paint(x, y) {
    cx.beginPath();
    cx.moveTo(x, y);
    cx.lineTo(x, y);
    cx.stroke();
    cx.closePath();
  }

  c.addEventListener('mouseup', onmouseup);
  c.addEventListener('mousedown', onmousedown);
  c.addEventListener('mousemove', onmousemove);
})();
