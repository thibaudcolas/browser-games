(function () {
  'use strict';

  var GAME = window.GAME || {};

  GAME.MAP = {
    tile       : 32,
    tileWidth  : 64,
    tileHeight : 48
  };

  GAME.cells = [];

  GAME.fn = {};

  // Returns the cell data for a given point.
  GAME.fn.getCellData = function(tx, ty) {
   return GAME.cells[tx + (ty * GAME.MAP.tileWidth)];
  };

  GAME.fn.pixelToTile = function(p) {
    return Math.floor(p / GAME.MAP.tile);
  };

  GAME.fn.tileToPixel = function(t) {
    return t * GAME.MAP.tile;
  };

  window.GAME = GAME;

})();
