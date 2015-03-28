'use strict';

$(document).ready(function() {
  restartGame($('.pacman-game')[0]);
});

function restartGame(container) {
  var game = new Pacman(container);

  game.start();
}
