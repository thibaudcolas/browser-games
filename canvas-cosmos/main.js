(function () {
  var canvas = document.getElementById('canvas');
  var canvas2 = document.getElementById('canvas2');
  var canvas3 = document.getElementById('canvas3');
  var ctx = canvas.getContext('2d');
  var ctx2 = canvas2.getContext('2d');
  var ctx3 = canvas3.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  var img = new Image();
  img.src = 'cosmos.jpg';
  ctx3.drawImage(img, 0, 0, 570, 570);

})();
