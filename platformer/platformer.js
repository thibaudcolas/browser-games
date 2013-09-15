(function (MAP, Entity) {
  'use strict';

  // https://developer.mozilla.org/en-US/docs/Web/API/Performance.now%28%29
  function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : Date.now();
  }

  function limit(min, x, max) {
    return Math.max(min, Math.min(max, x));
  }

  /**
   * Parameters.
   */

  var canvas = document.getElementById('js-platformer');
  var ctx    = canvas.getContext('2d');

  canvas.width  = MAP.tileWidth * MAP.tile;
  canvas.height = MAP.tileHeight * MAP.tile;

  var palette = {
    black:  '#000',
    yellow: '#ECD078',
    brick:  '#D95B43',
    pink:   '#C02942',
    purple: '#542437',
    grey:   '#333',
    slate:  '#53777A',
    gold:   'gold',
    steel:  'steelblue',
    cyan:   'cyan',
    dark:   'darkcyan'
  };
  var colors = [
    palette.yellow,
    palette.brick,
    palette.pink,
    palette.purple,
    palette.grey
  ];

  var time = {
    counter : 0,
    dt      : 0,
    now     : null,
    last    : timestamp(),
  };

  var fps      = 60;
  var step     = 1 / fps;
  var counter  = 0;

  var tiles  = [];
  var player = {};

  var keys = {
    space : 32,
    left  : 37,
    up    : 38,
    right : 39,
    down  : 40
  };

  /**
   * Converter functions.
   */

  // Returns the cell data for a given point.
  function getCellData(tx, ty) {
   return tiles[tx + (ty * MAP.tileWidth)];
  }

  function pixelToTile(p) {
    return Math.floor(p / MAP.tile);
  };

  function tileToPixel(t) {
    return t * MAP.tile;
  };

  /**
   * Setup functions.
   */

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

  function onkey(evt, key, isActive) {
    switch (key) {
      case keys.left:
        player.left  = isActive;
        evt.preventDefault();
        return false;

      case keys.right:
        player.right = isActive;
        evt.preventDefault();
        return false;
    }
  }

  function setup(map) {
    tiles = map.layers[0].data;

    var objects = map.layers[1].objects;

    for (var i = 0; i <objects.length; i++) {
      if (objects[i].type === 'player') {
        player = new Entity(objects[i]);
        console.dir(player);
      }
    }
  }

  /**
   * Update functions.
   */

  /**
   * Render functions.
   */

  function renderMap(ctx) {
    var tileData = null;
    for (var y = 0; y < MAP.tileHeight; y++) {
      for (var x = 0; x < MAP.tileWidth; x++) {
        tileData = getCellData(x, y);
        if (tileData) {
          ctx.fillStyle = colors[tileData - 1];
          ctx.fillRect(x * MAP.tile, y * MAP.tile, MAP.tile, MAP.tile);
        }
      }
    }
  }

  function renderPlayer(ctx, dt) {
    ctx.fillStyle = palette.yellow;
    ctx.fillRect(player.x + (player.dx * dt), player.y + (player.dy * dt), MAP.tile, MAP.tile);
  }

  /**
   * Main functions.
   */

  function update(dt) {
    player.update(dt);
  }

  function render(ctx, frame, dt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderMap(ctx);
    renderPlayer(ctx, dt);
  }

  function frame() {
    time.now = timestamp();
    time.dt += Math.min(1, (time.now - time.last) / 1000);
    while (time.dt > step) {
      time.dt -= step;
      update(step);
    }
    render(ctx, counter, time.dt);
    time.last = time.now;
    counter++;
    requestAnimationFrame(frame, canvas);
  }

  /**
   * Go!
   */

  get('level.json', function (req) {
    setup(JSON.parse(req.responseText));
    frame();
  });

  document.addEventListener('keydown', function (evt) {
    return onkey(evt, evt.keyCode, true);
  }, false);
  document.addEventListener('keyup',   function (evt) {
    return onkey(evt, evt.keyCode, false);
  }, false);

})(window.GAME.MAP, window.GAME.Entity);
