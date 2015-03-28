'use strict';

window.Pacman = (function() {
  var Pacman = function(container) {
    this.gameOver = true;
    this.container = container;
  }

  Pacman.prototype.start = function() {
    this.gameOver = false;

    this.p1 = {
      x: 14,
      y: 12,
      tile: '€' //this.TilePacmanLeft[0]
    };

    this.ghosts = [];

    this.generateMap();

    this.termConfig = {
      hud: {
        x: 3,
        y: 1
      },
      gameArea: {
        x: 3,
        y: 3
      }
    };

    this.term = new ut.Viewport(this.container, 50, 30);

    // ut.initInput(this.onKeyDown.bind(this));

    this.tick();
  };

  Pacman.prototype.generateMap = function() {
    this.map = [
      '############################',
      '#o...........##...........o#',
      '#.####.#####.##.#####.####.#',
      '#.####.#####.##.#####.####.#',
      '#..........................#',
      '#.####.#.##########.#.####.#',
      '#......#.....##.....#......#',
      '######.#####.##.#####.######',
      '     #.#............#.#     ',
      '######.#.####  ####.#.######',
      '.........#        #.........',
      '######.#.##########.#.######',
      '     #.#............#.#     ',
      '######.#.##########.#.######',
      '#............##............#',
      '#.####.#####.##.#####.####.#',
      '#...##................##...#',
      '###.##.#.##########.#.##.###',
      '#......#.....##.....#......#',
      '#.##########.##.##########.#',
      '#o........................o#',
      '############################'
    ];
  };

  Pacman.prototype.putTiles = function() {
    var base = this.termConfig.gameArea;
    var rowLength = this.map[0].length;

    for (var y = 0; y < this.map.length; y++) {
      for (var x = 0; x < rowLength; x++) {
        this.term.put(new ut.Tile('X', 150, 75, 0), base.x + x, base.y + y);
      }
    }
  };

  Pacman.prototype.tick = function() {
    this.term.clear();
    this.putTiles();
    this.term.render();
  };


  return Pacman;
}())
