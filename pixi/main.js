(function (PIXI) {
  'use strict';

  var stage = new PIXI.Stage(0x66FF99);
  var renderer = PIXI.autoDetectRenderer(400, 300);
  document.body.appendChild(renderer.view);

  window.requestAnimationFrame(animate);

  var bunny = PIXI.Sprite.fromImage('bunny.png');

  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;
  bunny.position.x = 200;
  bunny.position.y = 150;

  stage.addChild(bunny);

  function animate() {
    window.requestAnimationFrame(animate);

    bunny.rotation += 0.05;

    renderer.render(stage);
  }

})(window.PIXI);
