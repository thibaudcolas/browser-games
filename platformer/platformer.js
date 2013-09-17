(function (cells, MAP, Entity) {
  'use strict';

  var getCellData = window.GAME.fn.getCellData;
  var tileToPixel = window.GAME.fn.tileToPixel;

  // https://developer.mozilla.org/en-US/docs/Web/API/Performance.now%28%29
  function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : Date.now();
  }

  function glow(frame, duration) {
    var half  = duration / 2;
    var pulse = frame % duration;
    return pulse < half ? pulse / half : 1 - (pulse - half) / half;
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

  var player = {};
  var treasures = [];
  var monsters = [];

  var keys = {
    space : 32,
    left  : 37,
    up    : 38,
    right : 39,
    down  : 40
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

      case keys.up:
      case keys.space:
        player.jump = isActive;
        evt.preventDefault();
        return false;
    }
  }

  function setup(map) {
    window.GAME.cells = map.layers[0].data;
    cells = map.layers[0].data;

    var objects = map.layers[1].objects;

    for (var i = 0; i <objects.length; i++) {
      switch (objects[i].type) {
        case 'player':
          player = new Entity(objects[i]); break;
        case 'treasure':
          treasures.push(new Entity(objects[i])); break;
        case 'monster':
          monsters.push(new Entity(objects[i])); break;
        default:
          break;
      }
    }
  }

  /**
   * Update functions.
   */

  function updateTreasures(ft) {
    for (var i = 0; i < treasures.length; i++) {
      if (player.overlap(treasures[i], MAP.tile)) {
        player.collect();
        treasures.splice(i, 1);
      }
    }
  }

  function updateMonsters(dt) {
    for (var i = 0; i < monsters.length; i++) {
      monsters[i].update(dt);
      if (player.overlap(monsters[i], MAP.tile)) {
        if (player.dy > 0 && monsters[i].y - player.y > MAP.tile / 2) {
          player.kill(monsters[i]);
          monsters.splice(i, 1);
        }
        else {
          player.die(true);
        }
      }
    }
  }

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

    ctx.fillStyle = palette.gold;
    for(var i = 0; i < player.collected ; i++) {
      ctx.fillRect(tileToPixel(2 + i), tileToPixel(2), MAP.tile / 2, MAP.tile / 2);
    }
  }

  function renderTreasure(ctx, frame) {
    ctx.fillStyle = palette.gold;
    ctx.globalAlpha = 0.25 + glow(frame, 60);
    for(var i = 0; i < treasures.length; i++) {
      ctx.fillRect(treasures[i].x, treasures[i].y + MAP.tile / 3, MAP.tile, MAP.tile * (2 / 3));
    }
    ctx.globalAlpha = 1;
  }

  function renderMonsters(ctx, dt) {
    ctx.fillStyle = palette.slate;
    for(var i = 0; i < monsters.length; i++) {
      ctx.fillRect(monsters[i].x + (monsters[i].dx * dt), monsters[i].y + (monsters[i].dy * dt), MAP.tile, MAP.tile);
    }
  }

  /**
   * Main functions.
   */

  function update(dt) {
    player.update(dt);
    updateTreasures(dt);
    updateMonsters(dt);
  }

  function render(ctx, frame, dt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderMap(ctx);
    renderTreasure(ctx, frame);
    renderPlayer(ctx, dt);
    renderMonsters(ctx, dt);
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

})(window.GAME.cells, window.GAME.MAP, window.GAME.Entity);
