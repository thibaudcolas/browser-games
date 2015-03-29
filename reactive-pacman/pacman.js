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

    this.TileCode = {
      WALL: '#',
      POINT: '.',
      BIGP: 'o',
      EMPTY: ' '
    };

    this.TileDisplay = {
      WALL: new ut.Tile(' ', 0, 0, 0, 100, 100, 100),
      POINT: new ut.Tile('▪', 150, 0, 150),
      BIGP: new ut.Tile('O', 150, 0, 150),
      EMPTY: new ut.Tile(' ', 100, 100, 100)
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

  Pacman.prototype.getPacmanTile = function(x, y) {
    var tileData = this.map[y][x];
    var tileDisplay;

    switch (tileData) {
      case this.TileCode.POINT:
        tileDisplay = this.TileDisplay.POINT;
        break;
      case this.TileCode.BIGP:
        tileDisplay = this.TileDisplay.BIGP;
        break;
      case this.TileCode.WALL:
        tileDisplay = this.TileDisplay.WALL;
        break;
      case this.TileCode.EMPTY:
        tileDisplay = this.TileDisplay.EMPTY;
        break;
      default:
        tileDisplay = ut.NULLTILE;
        break;
    }

    return tileDisplay;
  };

  Pacman.prototype.putTiles = function() {
    var base = this.termConfig.gameArea;
    var rowLength = this.map[0].length;

    for (var y = 0; y < this.map.length; y++) {
      for (var x = 0; x < rowLength; x++) {
        this.term.put(this.getPacmanTile(x, y), base.x + x, base.y + y);
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
