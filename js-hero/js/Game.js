var Game = Backbone.View.extend({
  className: 'goals-timeline',

  template:
    '<div class="scene">' +
      '<div class="horizon"></div>' +
      '<div class="ground">' +
        '<svg width="0" height="0">' +
          '<defs>' +
            '<linearGradient id="goal-timeline-grad" x1="0" y1="0" x2="0" y2="100%">' +
              '<stop offset="0%" stop-color="#4d4f53" />' +
              '<stop offset="20%" stop-color="#666" />' +
              '<stop offset="100%" stop-color="#666" />' +
            '</linearGradient>' +
          '</defs>' +
          '<path class="fretboard"/>' +
          '<path class="verticals" />' +
        '</svg>' +
      '</div>' +
    '</div>' +
    '<div class="paused-text-container"><div class="paused-text">&#x25B6;</div></div>',

  options: {
    escKey : 27,
    maxnotesize: 80,
    accuracyOffset: 100,
    accuracy : 250,
    minTimeBetween: 750,
    maxTimeBetween: 1250,
    timeToShow: 6000,
    score: 0,
    interval: 1000 / 50,
    keys: [
      'A',
      'Z',
      'E',
      'R',
      'T',
      'Y',
      'U',
      'I',
      'O',
      'P'
    ]
  },

  track: new Howl({
    urls: ['tunes/brokeforfree-layers-ascolourfulasever.mp3', 'tunes/brokeforfree-layers-ascolourfulasever.ogg']
  }),

  date: new Date(),

  events: {},

  /****************************************
   * Setup.
   ****************************************/

  initialize: function () {
    this.notes = [];
    this.$document = $(document);
    this.$window = $(window);
    this.$body = $('body');
    this.$el.html(this.template);
    this.onInterval = this.onInterval.bind(this);
    this.setup();
    this.layout();
    this.attach();
    this.render();
  },

  setup: function () {
    this.timeScale = d3.time.scale().range([0, 1]);

    this.zIndexScale = d3.scale.linear()
      .domain([0, 1])
      .rangeRound([100, 10]);

    this.opacityScale = d3.scale.linear()
      .domain([-0.02, 0.00, 0.3, 1])
      .range([0.0, 1, 1, 0.1]);

    this.fretOpacityScale = d3.scale.linear()
      .domain([-0.02, 0.02, 0.3, 1])
      .range([0.0, 1, 0.1, 0]);

    this.xScale = d3.scale.linear().domain([-0.9, 0.9]);
    this.yScale = d3.scale.linear().domain([0, 1]);

    this.projectionScale = d3.scale.linear().domain([-0.01, 1.0]).range([1.00, 25]);

    this.colorScale = d3.scale.category10().domain([0, this.options.keys.length - 1]);
  },

  /****************************************
   * Event binding.
   ****************************************/

  attach: function () {
    var that = this;
    this.$document.on('keydown', this.onKeydown.bind(this));
    this.$window.on('resize', this.onWindowResize.bind(this));
    this.$window.on('scroll touchmove', function (evt) { evt.preventDefault(); });
    this.$body.on('scroll touchmove', function (evt) { evt.preventDefault(); });
    this.$body.find('.paused-text-container').on('click touchstart', function (evt) { that.start(); });
    this.$body.find('.score-bar').on('click touchstart', function (evt) {
      if (that.started) {
        that.stop();
      }
      else {
        that.start();
      }
    });
  },

  onWindowResize: function () {
    this.layout();
    this.render();
  },

  onKeydown: function (evt) {
    if (evt.altKey || evt.ctrlKey || evt.metaKey) {
      return;
    }
    if (evt.which === this.options.escKey) {
      evt.preventDefault();
      return this.started ? this.stop() : this.start();
    }
    if (!this.started) {
      return;
    }
    evt.preventDefault();
    this.processKeyHit(String.fromCharCode(evt.keyCode));
  },

  processKeyHit: function (key) {
    var current = new Date().getTime() + this.options.accuracyOffset;
    var high = current + this.options.accuracy;
    var low = current - this.options.accuracy;
    var note;

    if (this.options.keys.indexOf(key) !== -1) {
      for (var i = 0; i < this.notes.length; i++) {
        note = this.notes[i];
        if (note.timeStamp > high) {
          break;
        }
        if (!note.beenHit && note.key === key) {
          this.options.score++;
          note.beenHit = true;
          this.trigger('score', {score: this.options.score, note: note});
        }
      }
    }
  },

  /****************************************
   * Game logic.
   ****************************************/

  createNote: function (date) {
    var i = Math.floor(Math.random() * this.options.keys.length);
    return {
      date: date,
      timeStamp: date.getTime(),
      i: i,
      key: this.options.keys[i],
      color: this.colorScale(i),
      id: _.uniqueId('note')
    };
  },

  addNotes: function () {
    var last = _.last(this.notes);
    var difference = this.options.maxTimeBetween - this.options.minTimeBetween;
    var date = new Date(new Date().getTime() + this.options.timeToShow + Math.floor(Math.random() * this.options.interval));
    var note;
    var noteDelay;

    if (!last) {
      note = this.createNote(date);
    }
    else {
      noteDelay = date.getTime() - last.date.getTime();
      if (noteDelay > this.options.maxTimeBetween || (noteDelay > (difference * Math.random())) && noteDelay > this.options.minTimeBetween) {
        note = this.createNote(date);
      }
    }

    if (note) {
      this.notes.push(note);
    }
  },

  /****************************************
   * Rendering.
   ****************************************/

  layout : function () {
    var w = this.$el.width() || 848;
    var h = this.$el.height() || 518;
    var s = Math.min(w, h);
    var that = this;

    this.xScale.range([0, w]);
    this.yScale.range([h * 0.125, h]);

    d3.select(this.el).select('.ground').select('svg')
      .attr('width', w)
      .attr('height', h);

    d3.select(this.el).select('.horizon').style('top', function () {
      var z = that.timeScale.range()[0];
      var p = 1 / that.projectionScale(z);
      var delta = 2 / (that.options.keys.length + 1);
      return (that.yScale(p) + 5) + 'px';
    });

    d3.select(this.el).select('.horizon').style('left', function () {
      var z = that.timeScale.range()[0];
      var p = 1 / that.projectionScale(z);
      return (that.xScale(-1 * p) - 5) + 'px';
    });

    d3.select(this.el).select('.horizon').style('right', function () {
      var z = that.timeScale.range()[0];
      var p = 1 / that.projectionScale(z);
      return (that.xScale(-1 * p) - 5) + 'px';
    });

    d3.select('.fretboard').attr('d', function () {
      var near = 1 / that.projectionScale.range()[0];
      var delta = 2 / (that.options.keys.length + 1);
      var i = -1
      var d = [];
      d.push('M ' + that.xScale(1 * near * i) + ',' + that.yScale(near));
      d.push('L ' + that.xScale(0) + ',' + that.yScale(0));
      d.push('L ' + that.xScale(1 * near * (-1 + delta * (that.options.keys.length + 1))) + ',' + that.yScale(near));

      return d.join(' ');
    });

    d3.select(this.el).select('.verticals').attr('d', function () {
      var
        near = 1 / that.projectionScale.range()[0],
        far = 1 / that.projectionScale.range()[1],
        i = -1,
        delta = 2 / (that.options.keys.length + 1)
        segs = [];

      while (1 > (i += delta)) {
        segs.push(
          'M ' + that.xScale(0) + ',' + that.yScale(0) + ' ' +
          'L ' + that.xScale(1 * near * i) + ',' + that.yScale(near - delta) +
          'L ' + that.xScale(1 * i) + ',' + that.yScale(near)
        );
      }
      return segs.join(' ');
    });
  },

  render: function () {
    this.renderFrets();
    this.renderNotes();
  },

  renderNotes: function () {
    var that = this;
    var notes;

    notes = d3.select(this.el).selectAll('.note')
      .data(this.notes, function (d) {
        return d.id;
      });

    notes.enter()
      .append('div')
        .attr('class', 'note')
        .attr('data-r', function (d) {
          var
            z = that.timeScale(d.date),
            p = 1 / that.projectionScale(z),
            r = that.options.maxnotesize * p,
            $this = $(this);
          this.$this = $this;
          $this.css({
            width: r * 2,
            height: r * 2,
            backgroundColor: d.color
          });
          this.innerHTML = d.key;
          return r;
        })
        .style('opacity', 1e-3);

    notes
      .attr('data-r', function (d, i) {
        var
          z = that.timeScale(d.date),
          p = 1 / that.projectionScale(z),
          r = Math.max(~~(that.options.maxnotesize * p), 0.01);

          this.$this.css({
            fontSize: r,
            width: r*2,
            height: r*2,
          });
          if (d.beenHit && !d.classAdded) {
            d.classAdded = true;
            this.$this.addClass('has-been-hit');
          }
          return r;
      })
      .style('opacity', function (d) {
        var z = that.timeScale(d.date);
        return that.opacityScale(z);
      })
      .style('z-index', function (d, i, a) {
        return that.zIndexScale(that.timeScale(d.date));
      })
      .style('top', function (d) {
        var
          z = that.timeScale(d.date),
          p = 1 / that.projectionScale(z),
          r = that.options.maxnotesize * p;
        return that.yScale(p) + 'px';
      })
      .style('left', function (d, i) {
        var
          division = 2 / (that.options.keys.length + 1),
          z = that.timeScale(d.date),
          p = 1 / that.projectionScale(z),
          r = that.options.maxnotesize * p,
          c = -1 + ((d.i%that.options.keys.length) + 1) * division;
        return that.xScale(c*p) + 'px';
      })
      .style('margin-top', function (d) {
        var
          z = that.timeScale(d.date),
          p = 1 / that.projectionScale(z),
          r = that.options.maxnotesize * p;
        return -r*2 + 'px';
      })
      .style('margin-left', function (d) {
        var
          z = that.timeScale(d.date),
          p = 1 / that.projectionScale(z),
          r = that.options.maxnotesize * p;
        return -r + 'px';
      });

    notes
      .exit()
      .remove();
  },

  renderFrets: function () {
    var that = this;
    var ticks = this.timeScale.ticks(d3.time.seconds, 1);
    var frets;

    frets = d3.select(this.el).select('.ground').selectAll('.fret')
      .data(ticks, function (d) {
        return d.getTime();
      });

    frets.enter()
      .insert('div', ':first-child')
        .attr('class', 'fret')
        .style('opacity', 0);

    frets
      .style('opacity', function (d) {
        var z = that.timeScale(d);
        return that.fretOpacityScale(z);
      })
      .style('z-index', function (date, i, a) {
        return that.zIndexScale(that.timeScale(date)) - 2;
      })
      .style('top', function (d) {
        var
          z = that.timeScale(d),
          p = 1 / that.projectionScale(z);
        return that.yScale(p) + 'px';
      })
      .style('left', function (d) {
        var
          z = that.timeScale(d),
          p = 1 / that.projectionScale(z);
        return that.xScale(-1 * p) + 'px';
      })
      .style('right', function (d) {
        var
          z = that.timeScale(d),
          p = 1 / that.projectionScale(z);
        return that.xScale(-1 * p) + 'px';
      })
      .style('font-size', function (d) {
        var
          z = that.timeScale(d),
          p = 1 / that.projectionScale(z);
        return (p * 35) + 'px';
      });

    frets.exit()
      .remove();
  },

  /****************************************
   * Game loop.
   ****************************************/

  onInterval: function () {
    this.setDate();
    this.addNotes();
  },

  interpreteData: function () {
    this.timeScale.domain([this.date, new Date(this.date.getTime() + this.options.timeToShow)]);
  },

  cleanData: function () {
    this.notes = _.filter(this.notes, function (o) {
      return (o.date.getTime() + 1000) > this.date.getTime();
    }, this);
  },

  setDate: function () {
    this.date = new Date();
    this.cleanData();
    this.interpreteData();
    this.render();
  },

  start: function () {
    if (!this.started) {
      this.started = true;
      this.layout();

       this.track.play();

      if (this.stoppedTime && this.notes.length) {
        this.adjustDataForStoppedTime();
      }

      this.setDate();
      this.interval = window.setInterval(this.onInterval, this.options.interval);
      this.$el.removeClass('paused');
    }
  },

  stop: function () {
    if (this.started) {
      window.clearInterval(this.interval);
      this.$el.addClass('paused');

      this.track.pause();

      this.started = false;
      this.stoppedTime = new Date();
    }
  },

  adjustDataForStoppedTime: function () {
    var diff = new Date().getTime() - this.stoppedTime.getTime();
    _.each(this.notes, function (n) {
      n.date = new Date(n.date.getTime() + diff);
    });
  },
});
