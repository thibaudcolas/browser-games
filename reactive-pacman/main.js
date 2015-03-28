'use strict';

$(document).ready(function() {
  restartGame($('<div/>'));
});

function restartGame(container) {
  var game = new Pacman(container);

  game.start();
}
