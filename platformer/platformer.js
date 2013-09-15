(function () {
  'use strict';

  var GAME = {};

  GAME.map = {
    tile: 32,
    tileWidth: 64,
    tileHeight: 48,
  };

  GAME.width  = GAME.map.tileWidth * GAME.map.tile;
  GAME.height = GAME.map.tileHeight * GAME.map.tile;

  GAME.canvas = document.getElementById('js-platformer');
  GAME.ctx    = GAME.canvas.getContext('2d');

  GAME.canvas.width  = GAME.width;
  GAME.canvas.height = GAME.height;

  function render(ctx, frame, dt) {
    ctx.clearRect(0, 0, GAME.map.width, GAME.map.height);
  }

  function setup(map) {
    console.dir(map);
  }

  function frame() {
    requestAnimationFrame(frame, GAME.canvas);
  }

  function get(url, onsuccess) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        onsuccess(request);
      }
    };
    request.open('GET', url, true);
    request.send();
  }

  get('level.json', function (req) {
    setup(JSON.parse(req.responseText));
    frame();
  });

})();
