(function (PIXI) {
  'use strict';

  var stage = new PIXI.Stage(0x66FF99);
  var renderer = PIXI.autoDetectRenderer(400, 300);
  document.body.appendChild(renderer.view);

  window.requestAnimationFrame(animate);

  var texture = PIXI.Texture.fromImage('bunny.png');
  var bunny = new PIXI.Sprite(texture);

  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;
  bunny.position.x = 50;
  bunny.position.y = 50;

  stage.addChild(bunny);

  function animate() {
    window.requestAnimationFrame(animate);

    bunny.rotation -= 0.05;

    bunny.position.x += backAndForth(0, bunny.position.x, 400);

    renderer.render(stage);
  }

})(window.PIXI);

function backAndForth(lowest, current, highest) {
  var threshold = 25;
  this.forth = (typeof this.forth === 'undefined') ? true : this.forth;
  this.forth = this.forth && current < highest - threshold || current < lowest + threshold;
  return this.forth ? 1 : -1;
}
