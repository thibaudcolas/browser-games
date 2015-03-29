window.Pacman = (function() {
  'use strict';

  var Pacman = function(container) {
    this.gameOver = true;
    this.container = container;
    this.onPacmanMove = null;

    this.PacmanTile = {
      LEFT: [new ut.Tile('ᗤ', 255, 248, 74), new ut.Tile('ᗞ', 255, 248, 74)],
      RIGHT: [new ut.Tile('ᗧ', 255, 248, 74), new ut.Tile('ᗡ', 255, 248, 74)],
      UP: [new ut.Tile('ᗢ', 255, 248, 74), new ut.Tile('ᗜ', 255, 248, 74)],
      DOWN: [new ut.Tile('ᗣ', 255, 248, 74), new ut.Tile('ᗝ', 255, 248, 74)]
    };

    this.MapTileCode = {
      WALL: '#',
      POINT: '.',
      BIGP: 'o',
      EMPTY: ' '
    };

    this.MapTileDisplay = {
      WALL: new ut.Tile(' ', 0, 0, 0, 0, 71, 241),
      POINT: new ut.Tile('・', 238, 179, 149),
      BIGP: new ut.Tile('●', 238, 179, 149),
      EMPTY: new ut.Tile(' ', 100, 100, 100)
    };
  }

  Pacman.prototype.start = function() {
    this.gameOver = false;

    this.p1 = {
      x: 14,
      y: 12,
      tile: this.PacmanTile.LEFT[0]
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

    this.term = new ut.Viewport(this.container, 50, 30, 'auto', true);

    ut.initInput(this.onKeyDown.bind(this));
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

  Pacman.prototype.getMapTile = function(x, y) {
    var tileData = this.map[y][x];
    var mapTileDisplay;

    switch (tileData) {
      case this.MapTileCode.POINT:
        mapTileDisplay = this.MapTileDisplay.POINT;
        break;
      case this.MapTileCode.BIGP:
        mapTileDisplay = this.MapTileDisplay.BIGP;
        break;
      case this.MapTileCode.WALL:
        mapTileDisplay = this.MapTileDisplay.WALL;
        break;
      case this.MapTileCode.EMPTY:
        mapTileDisplay = this.MapTileDisplay.EMPTY;
        break;
      default:
        mapTileDisplay = ut.NULLTILE;
        break;
    }

    return mapTileDisplay;
  };

  Pacman.prototype.putTiles = function() {
    var base = this.termConfig.gameArea;
    var rowLength = this.map[0].length;

    for (var y = 0; y < this.map.length; y++) {
      for (var x = 0; x < rowLength; x++) {
        this.term.put(this.getMapTile(x, y), base.x + x, base.y + y);
      }
    }
  };

  Pacman.prototype.putPlayer = function() {
    var base = this.termConfig.gameArea;

    this.term.put(this.p1.tile, base.x + this.p1.x, base.y + this.p1.y);
  };

  Pacman.prototype.onKeyDown = function(key) {
    var moveV = {
      x: 0,
      y: 0
    };

    switch (key) {
      case ut.KEY_UP:
        moveV.y--;
        break;
      case ut.KEY_LEFT:
        moveV.x--;
        break;
      case ut.KEY_DOWN:
        moveV.y++;
        break;
      case ut.KEY_RIGHT:
        moveV.x++;
        break;
      case ut.KEY_SPACE:
        if (this.gameOver) {
          moveV = null;
        }
        break;
      default:
        break;
    }

    if (typeof this.onPacmanMove === 'function') {
      this.onPacmanMove(moveV);
    }
  };

  Pacman.prototype.canMoveTo = function(x, y) {
    var tile = this.getMapTile(x, y);
    return [this.MapTileDisplay.POINT, this.MapTileDisplay.BIGP, this.MapTileDisplay.EMPTY].indexOf(tile) !== -1;
  };

  Pacman.prototype.movePacman = function(p1V) {
    var p1 = {
      x: this.p1.x + p1V.x,
      y: this.p1.y + p1V.y,
      tile: this.PacmanTile.DOWN
    };

    if (this.gameOver) {
      return;
    }

    if (!this.canMoveTo(p1.x, p1.y)) {
      return;
    }

    if (p1V.x < 0) {
      p1.tile = this.PacmanTile.LEFT;
    } else if (p1V.x > 0) {
      p1.tile = this.PacmanTile.RIGHT;
    } else if (p1V.y < 0) {
      p1.tile = this.PacmanTile.UP;
    }

    if (p1.tile[0] === this.p1.tile) {
      p1.tile = p1.tile[1];
    } else {
      p1.tile = p1.tile[0];
    }

    this.p1 = p1;
  };

  Pacman.prototype.tick = function() {
    this.term.clear();
    this.putTiles();
    this.putPlayer();
    this.term.render();
  };


  return Pacman;
}())
