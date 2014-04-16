'use strict';

angular.module('Game', ['Grid'])
.service('GameManager', [
  'GridService',
  function (GridService) {
    // Create a new game
    this.newGame = function() {};
    // Handle the move action
    this.move = function() {};
    // Update the score
    this.updateScore = function(newScore) {};
    // Are there moves left?
    this.movesAvailable = function() {
      return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
    };
  }
]);
