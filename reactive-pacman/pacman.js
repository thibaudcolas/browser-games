'use strict';

window.Pacman = (function() {
  var Pacman = function(container) {
    this.gameOver = true;
    this.container = container;
  }

  Pacman.prototype.start = function() {
    this.gameOver = false;

    // this.generateMap();

    this.term = new ut.Viewport(this.container, 50, 30);

    this.term.clear();

    this.term.putString("Hello world!", 0,0, 0,255,0);
    this.term.putString("Some unicode chars: ", 0,2, 128,0,0, 0,32,0);
    this.term.putString("☠☃⚙☻♞☭✈✟✂✯", 0,3, 0,0,255);

    this.term.render();

    // ut.initInput(this.onKeyDown.bind(this));

    // this.tick();
  };

  return Pacman;
}())
