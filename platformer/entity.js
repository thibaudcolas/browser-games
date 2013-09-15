(function (MAP) {
  'use strict';

  var tileToPixel = window.GAME.fn.tileToPixel;
  var pixelToTile = window.GAME.fn.pixelToTile;
  var getCellData = window.GAME.fn.getCellData;

  var defaults = {
    gravity  : 9.8 * 6,
    maxdx    : 15,
    maxdy    : 60,
    accel    : 0.5,
    friction : 0.15,
    impulse  : 1500
  };

  function limit(min, x, max) {
    return Math.max(min, Math.min(max, x));
  }

  var Entity = function(raw) {
    this.x           = raw.x;
    this.y           = raw.y;
    this.dx          = 0;
    this.dy          = 0;
    this.gravity     = MAP.tile * (raw.properties.gravity || defaults.gravity);
    this.maxdx       = MAP.tile * (raw.properties.maxdx   || defaults.maxdx);
    this.maxdy       = MAP.tile * (raw.properties.maxdy   || defaults.maxdy);
    this.impulse     = MAP.tile * (raw.properties.impulse || defaults.impulse);
    this.accel       = this.maxdx / (raw.properties.accel    || defaults.accel);
    this.friction    = this.maxdx / (raw.properties.friction || defaults.friction);
    this.isPlayer    = raw.type === 'player';
    this.left        = raw.properties.left;
    this.right       = raw.properties.right;
    this.jump        = false;
  };

  Entity.prototype.update = function(dt) {

    this.ddy = this.gravity;
    this.y += dt * this.dy;
    this.dy += limit(-this.maxdy, dt * this.ddy, this.maxdy);

    var tx        = pixelToTile(this.x),
        ty        = pixelToTile(this.y),
        nx        = this.x % MAP.tile,
        ny        = this.y % MAP.tile,
        cell      = getCellData(tx,     ty),
        cellright = getCellData(tx + 1, ty),
        celldown  = getCellData(tx,     ty + 1),
        celldiag  = getCellData(tx + 1, ty + 1);

    if (this.dy > 0) {
      if ((celldown && !cell) ||
          (celldiag && !cellright && nx)) {
        this.y = tileToPixel(ty);
        this.dy = 0;
        this.falling = false;
        this.jumping = false;
        ny = 0;
      }
    }
    else if (this.dy < 0) {
      if ((cell      && !celldown) ||
          (cellright && !celldiag && nx)) {
        this.y = tileToPixel(ty + 1);
        this.dy = 0;
        cell      = celldown;
        cellright = celldiag;
        ny        = 0;
      }
    }
  };

  window.GAME.Entity = Entity;

})(window.GAME.MAP);
