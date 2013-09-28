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
          '<path class="grass" d="M 0,0 L 0,0 L 0,0, L 0,0 z" fill="url(#goal-timeline-grad)"/>' +
          '<path class="verticals" />' +
          '<path class="fretboard"/>' +
        '</svg>' +
      '</div>' +
    '</div>',

  options: {
    escKey : 27,
    maxBubbleSize: 80,
    accuracyOffset: 100,
    minTimeBetween: 750,
    maxTimeBetween: 1250,
    timeToShow: 6000,
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

  date: new Date(),

  events: {},

  /****************************************
   * Setup.
   ****************************************/

  initialize: function () {
    this.bubbles = [];
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
    this.$document.on('keydown', this.onKeydown.bind(this));
    this.$window.on('resize', this.onWindowResize.bind(this));
    this.$window.on('scroll touchmove', function (evt) { evt.preventDefault(); });
    this.$body.on('scroll touchmove', function (evt) { evt.preventDefault(); });
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
    }
    console.log(evt.which);
  },

  /****************************************
   * Game logic.
   ****************************************/

  createBubble: function (date) {
    var i = Math.floor(Math.random() * this.options.keys.length);
    return {
      date: date,
      timeStamp: date.getTime(),
      i: i,
      key: this.options.keys[i],
      color: this.colorScale(i),
      id: _.uniqueId('bubble')
    };
  },

  addBubbles: function () {
    var last = _.last(this.bubbles);
    var difference = this.options.maxTimeBetween - this.options.minTimeBetween;
    var date = new Date(new Date().getTime() + this.options.timeToShow + Math.floor(Math.random() * this.options.interval));
    var bubble;
    var bubbleDelay;

    if (!last) {
      bubble = this.createBubble(date);
    }
    else {
      bubbleDelay = date.getTime() - last.date.getTime();
      if (bubbleDelay > this.options.maxTimeBetween || (bubbleDelay > (difference * Math.random())) && bubbleDelay > this.options.minTimeBetween) {
        bubble = this.createBubble(date);
      }
    }

    if (bubble) {
      this.bubbles.push(bubble);
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
      var z = that.timeScale(new Date(that.date.getTime()) + (that.options.accuracyOffset / 2));
      var p = 1 / that.projectionScale(z);
      return Math.ceil(that.yScale(p)) + 'px';
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
          'L ' + that.xScale(1 * near * i) + ',' + that.yScale(near)
        );
        console.log(i);
      }
      return segs.join(' ');
    });
  },

  render: function () {
    this.renderFrets();
    this.renderBubbles();
    console.log('render');
  },

  renderBubbles: function () {
    var that = this;
    var bubbles;

    bubbles = d3.select(this.el).selectAll('.bubble')
      .data(this.bubbles, function (d) {
        return d.id;
      });

    bubbles.enter()
      .append('div')
        .attr('class', 'bubble')
        .attr('data-r', function (d) {
          var
            z = that.timeScale(d.date),
            p = 1 / that.projectionScale(z),
            r = that.options.maxBubbleSize * p,
            $this = $(this);
          this.$this = $this;
          $this.css({
            fontSize: r,
            width: r * 2,
            height: r * 2,
            backgroundColor: d.color
          });

          this.innerText = d.key;
          return r;
        })
        .style('opacity', 1e-3);

    bubbles
      .attr('data-r', function (d, i) {
        var
          z = that.timeScale(d.date),
          p = 1 / that.projectionScale(z),
          r = Math.max(~~(that.options.maxBubbleSize * p), 0.01);

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
          r = that.options.maxBubbleSize * p;
        return that.yScale(p) + 'px';
      })
      .style('left', function (d, i) {
        var
          division = 2 / (that.options.keys.length + 1),
          z = that.timeScale(d.date),
          p = 1 / that.projectionScale(z),
          r = that.options.maxBubbleSize * p,
          c = -1 + ((d.i%that.options.keys.length) + 1) * division;
        return that.xScale(c*p) + 'px';
      })
      .style('margin-top', function (d) {
        var
          z = that.timeScale(d.date),
          p = 1 / that.projectionScale(z),
          r = that.options.maxBubbleSize * p;
        return -r*2 + 'px';
      })
      .style('margin-left', function (d) {
        var
          z = that.timeScale(d.date),
          p = 1 / that.projectionScale(z),
          r = that.options.maxBubbleSize * p;
        return -r + 'px';
      });

    bubbles
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
    this.addBubbles();
  },

  interpreteData: function () {
    this.timeScale.domain([this.date, new Date(this.date.getTime() + this.options.timeToShow)]);
  },

  cleanData: function () {
    this.bubbles = _.filter(this.bubbles, function (o) {
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
      this.setDate();
      this.interval = window.setInterval(this.onInterval, this.options.interval);
    }
  }
});
