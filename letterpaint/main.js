(function () {
  'use strict';

  var c = document.getElementById('js-paint');
  var cx = c.getContext('2d');
  c.height = 480;
  c.width = 320;
  cx.lineWidth = 20;
  cx.lineCap = 'round';
  cx.strokeStyle = 'rgb(0, 0, 50)';

  function onmousemove(ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    paint(x, y);
  }

  function paint(x, y) {
    cx.beginPath();
    cx.moveTo(x, y);
    cx.lineTo(x, y);
    cx.stroke();
    cx.closePath();
  }

  c.addEventListener('mousemove', onmousemove, false);
})();
