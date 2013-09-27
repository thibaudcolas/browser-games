var Game = Backbone.View.extend({
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
        '</svg>' +
      '</div>' +
    '</div>',

  options: {
    escKey : 27,
    accuracyOffset: 100,
    timeToShow: 6000,
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

  events: {

  },

  initialize: function () {
    this.data = [];
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

    this.xScale = d3.scale.linear().domain([-0.9, 0.9]);
    this.yScale = d3.scale.linear().domain([0, 1]);

    this.projectionScale = d3.scale.linear().domain([-0.01, 1.0]).range([1.00, 25]);
  },

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

  layout : function () {
    var w = this.$el.width() || 848;
    var h = this.$el.height() || 518;
    var s = Math.min(w, h);

    this.xScale.range([0, w]);
    this.yScale.range([h * 0.125, h]);

    d3.select(this.el).select('.ground').select('svg')
      .attr('width', w)
      .attr('height', h);
  },

  render: function () {
    this.renderGround();
    console.log('render');
  },

  renderGround: function () {
    var that = this;
    var ticks = this.timeScale.ticks(d3.time.seconds, 1);
    var markers;

    d3.select(this.el).select('.horizon').style('top', function () {
      var z = that.timeScale(new Date(that.date.getTime()) + (that.options.accuracyOffset / 2));
      var p = 1 / that.projectionScale(z);
      return Math.ceil(that.yScale(p)) + 'px';
    });

    d3.select(this.el).select('.verticals')
      .attr('d', function () {
        var
          near = 1 / that.projectionScale.range()[0],
          far = 1 / that.projectionScale.range()[1],
          i = -1,
          delta = 2 / (that.options.keys.length + 1)
          segs = [];

        while (1 > (i += delta)) {
          segs.push(
            'M ' + that.xScale(0) + ',' + that.yScale(0) + ' ' +
            'L ' + that.xScale( 1*near * i) + ',' + that.yScale(near)
          );
        }
        return segs.join(' ');
      });
  },

  onInterval: function () {
    this.setDate();
  },

  interpreteData: function () {
    this.timeScale.domain([this.date, new Date(this.date.getTime() + this.options.timeToShow)]);
  },

  cleanData: function () {
    this.data = _.filter(this.data, function (o) {
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
