(function () {
  'use strict';

  var canvas = document.getElementById('canvas');
  var canvas2 = document.getElementById('canvas2');
  var canvas3 = document.getElementById('canvas3');
  var ctx = canvas.getContext('2d');
  var ctx2 = canvas2.getContext('2d');
  var ctx3 = canvas3.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  var img = document.getElementById('cosmos');

  var puffs = [];

  var Puff = function (p) {
    this.p = p;
    this.opacity = Math.sin(p * 0.05) * 0.5;
    this.sx = (Math.random() * 285) >> 0;
    this.sy = (Math.random() * 285) >> 0;

    this.move = function (time) {
      p = this.p + 0.3 * time;
      this.opacity = Math.sin(p * 0.05) * 0.5;
      if (this.opacity < 0) {
        p = this.opacity = 0;
        this.sx = (Math.random() * 285) >> 0;
        this.sy = (Math.random() * 285) >> 0;
      }
      this.p = p;
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(canvas3, this.sx + p, this.sy + p, 285 - (p * 2),285 - (p * 2), 0,0, w, h);
    };
  };

  var sortPuff = function(p1, p2) { return p1.p-p2.p; };
  puffs.push(new Puff(0));
  puffs.push(new Puff(20));
  puffs.push(new Puff(40));

  var before = Date.now();
  var now = null;
  var time = null;

  function loop () {
    now = Date.now();
    time = (now - before) * 0.01;
    time = Math.max(time, 3);
    before = now;

    puffs.sort(sortPuff);

    puffs[0].move(time);
    puffs[1].move(time);
    puffs[2].move(time);

    ctx2.drawImage(canvas,0 ,0 ,570 ,570);
    window.requestAnimationFrame(loop, canvas);
  }

  img.addEventListener('load', function () {
    ctx3.drawImage(img, 0, 0, 570, 570);
    loop();
  });

})();
