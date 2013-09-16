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
    this.left        = raw.properties.left;
    this.right       = raw.properties.right;
    this.jump        = false;
  };

  Entity.prototype.update = function(dt) {
    var movingLeft = this.dx < 0;
    var movingRight = this.dx > 0;

    this.ddx = 0;

    var drag = this.falling ? 0.8 : 1;

    // Accel / friction to the left.
    if (this.left) {
      this.ddx -= this.accel * drag;
    }
    else if (movingLeft) {
      this.ddx += this.friction * drag;
    }

    // Accel / friction to the right.
    if (this.right) {
      this.ddx += this.accel * drag;
    }
    else if (movingRight) {
      this.ddx -= this.friction * drag;
    }

    // Gravity.
    this.ddy = this.gravity;

    // Jump impulse.
    if (this.jump && !this.jumping && !this.falling) {
      this.ddy -= this.impulse;
      this.jumping = true;
    }

    // Actual movement.
    this.x += dt * this.dx;
    this.y += dt * this.dy;
    this.dx += limit(-this.maxdx, dt * this.ddx, this.maxdx);
    this.dy += limit(-this.maxdy, dt * this.ddy, this.maxdy);

    // Lag when changing direction.
    if ((movingLeft  && this.dx > 0) || (movingRight && this.dx < 0)) {
      this.dx = 0;
    }

    var tileX        = pixelToTile(this.x);
    var tileY        = pixelToTile(this.y);
    var nx        = this.x % MAP.tile;
    var ny        = this.y % MAP.tile;
    var cell      = getCellData(tileX,     tileY);
    var cellright = getCellData(tileX + 1, tileY);
    var celldown  = getCellData(tileX,     tileY + 1);
    var celldiag  = getCellData(tileX + 1, tileY + 1);

    if (this.dx > 0) {
      if ((cellright && !cell) ||
          (celldiag  && !celldown && ny)) {
        this.x = tileToPixel(tileX);
        this.dx = 0;
      }
    }
    else if (this.dx < 0) {
      if ((cell     && !cellright) ||
          (celldown && !celldiag && ny)) {
        this.x = tileToPixel(tileX + 1);
        this.dx = 0;
      }
    }

    var movingUp = this.dy < 0;
    var movingDown = this.dy > 0;

    if (movingDown) {
      if ((celldown && !cell) ||
          (celldiag && !cellright && nx)) {
        this.y = tileToPixel(tileY);
        this.dy = 0;
        this.falling = false;
        this.jumping = false;
        ny = 0;
      }
    }
    else if (movingUp) {
      if ((cell      && !celldown) ||
          (cellright && !celldiag && nx)) {
        this.y = tileToPixel(tileY + 1);
        this.dy = 0;
        cell      = celldown;
        cellright = celldiag;
        ny        = 0;
      }
    }

    this.falling = !(celldown || (nx && celldiag));
  };

  window.GAME.Entity = Entity;

})(window.GAME.MAP);
