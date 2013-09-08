(function (PIXI) {
  'use strict';

  var stage = new PIXI.Stage(0x66FF99);
  var renderer = PIXI.autoDetectRenderer(500, 500);
  document.body.appendChild(renderer.view);

  var texture = PIXI.Texture.fromImage('bunny.png');
  var bunny = new PIXI.Sprite(texture);

  var direction = 1;
  var scale = 0;
  var forth = true;

  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;
  bunny.position.x = 50;
  bunny.position.y = 50;
  bunny.scale.x = 2;
  bunny.scale.y = 2;

  stage.addChild(bunny);

  var loader = new PIXI.AssetLoader(["aliens.json"]);

  var alienContainer = new PIXI.DisplayObjectContainer();
  alienContainer.position.x = 300;
  alienContainer.position.y = 100;
  stage.addChild(alienContainer);

  loader.onComplete = function () {
    var alienFrames = ["eggHead.png", "flowerTop.png"];

    for (var i = 0; i < 2; i++) {
      var alien = PIXI.Sprite.fromFrame(alienFrames[i]);

      alien.position.x = Math.random() * 200;
      alien.position.y = Math.random() * 200;
      alien.rotation = Math.random() * 100;
      alien.anchor.x = 0.5;
      alien.anchor.y = 0.5;
      alienContainer.addChild(alien);
    }
  };
  loader.load();

  window.requestAnimationFrame(animate);

  function animate() {
    window.requestAnimationFrame(animate);

    direction = backAndForth(0, bunny.position.x, 500, 50);
    bunny.rotation += direction * 0.05;
    bunny.position.x += direction * 1;

    scale += 0.01;
    alienContainer.scale.x = Math.sin(scale);
    alienContainer.scale.y = Math.sin(scale);
    alienContainer.rotation += 0.01;

    renderer.render(stage);
  }

  function backAndForth(lowest, current, highest, threshold) {
    forth = forth && current < highest - threshold || current < lowest + threshold;
    return forth ? 1 : -1;
  }

})(window.PIXI);


