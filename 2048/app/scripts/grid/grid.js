'use strict';

angular.module('Grid', [])
.service('GridService', function() {
  this.grid   = [];
  this.tiles  = [];
  // Size of the board
  this.size   = 4;
  // ...
});
