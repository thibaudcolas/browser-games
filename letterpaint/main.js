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
  var letterColor = {
    r: 200,
    g: 30,
    b: 30,
    a: 1
  };
  cx.fillStyle = 'rgba(' + letterColor.r + ', ' + letterColor.g + ', ' + letterColor.b + ', ' + letterColor.a + ')';
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

  var pixels = cx.getImageData(0, 0, c.width, c.height);

  function getPointColor(x, y) {
    // 4 cells per point, all in a one-dimension array.
    var i = (x + y * pixels.width) * 4;
    return {
      r: pixels.data[i],
      g: pixels.data[i + 1],
      b: pixels.data[i + 2],
      a: pixels.data[i + 3]
    };
  }

  function isOnLetter(x, y) {
    var color = getPointColor(x, y);
    return color.a !== 0;
  }

  function isOnCanvas(p) {
    return 0 < p.x && p.x <= c.width && 0 < p.y && p.y <= c.height;
  }

  function paint(x, y) {
    if (isOnLetter(x, y)) {
      cx.beginPath();
      if (isOnCanvas(lastPosition)) {
        cx.moveTo(lastPosition.x, lastPosition.y);
      }
      cx.lineTo(x, y);
      cx.stroke();
      cx.closePath();
    }
  else {
    mouseDown = false;
    alert(':(');
  }
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
});
})();




