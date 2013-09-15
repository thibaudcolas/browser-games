(function () {
  'use strict';

  // https://developer.mozilla.org/en-US/docs/Web/API/Performance.now%28%29
  function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : Date.now();
  }

  /**
   * Parameters.
   */

  var map = {
    tile       : 32,
    tileWidth  : 64,
    tileHeight : 48
  };

  var canvas = document.getElementById('js-platformer');
  var ctx    = canvas.getContext('2d');

  canvas.width  = map.tileWidth * map.tile;
  canvas.height = map.tileHeight * map.tile;

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

  var tiles = [];

  /**
   * Converter functions.
   */

  // Returns the cell data for a given point.
  function getTileData(tx, ty) {
   return tiles[tx + (ty * map.tileWidth)];
  }

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

  function setup(map) {
    tiles = map.layers[0].data;
  }

  /**
   * Update functions.
   */

  /**
   * Render functions.
   */

  function renderMap(ctx) {
    var tileData = null;
    for (var y = 0; y < map.tileHeight; y++) {
      for (var x = 0; x < map.tileWidth; x++) {
        tileData = getTileData(x, y);
        if (tileData) {
          ctx.fillStyle = colors[tileData - 1];
          ctx.fillRect(x * map.tile, y * map.tile, map.tile, map.tile);
        }
      }
    }
  }

  /**
   * Main functions.
   */

  function update(step) {
  }

  function render(ctx, frame, dt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderMap(ctx);
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

})();
