'use strict';

$(document).ready(function() {
  restartGame($('.pacman-game')[0]);
});

function restartGame(container) {
  var game = new Pacman(container);

  game.start();

  var moveStream = Bacon.fromBinder(function(sink) {
    game.onPacmanMove = function(moveV) {
      sink(moveV);
    };
  });

  moveStream.onValue(function(moveV) {
    if (!moveV) {
      restartGame(container);
      return;
    }

    game.movePacman(moveV);
  });

  var combinedTickStream = new Bacon.Bus();

  combinedTickStream.plug(moveStream);
  combinedTickStream.subscribe(function() {
    game.tick();
  });
}
