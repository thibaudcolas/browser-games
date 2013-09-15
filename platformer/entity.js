(function (MAP) {
  'use strict';

  var defaults = {
    gravity  : 9.8 * 6,
    maxdx    : 15,
    maxdy    : 60,
    accel    : 0.5,
    friction : 0.15,
    impulse  : 1500
  };

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
  };

  Entity.prototype.update = function(dt) {
    this.x -= this.left ? 1 : 0;
    this.x += this.right ? 1 : 0;
  };

  window.GAME.Entity = Entity;

})(window.GAME.MAP);
