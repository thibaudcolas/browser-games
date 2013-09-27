var Game = Backbone.View.extend({
  template:
    '<div class="scene">' +
      '<div class="horizon"></div>' +
    '</div>',

  options: {
    escKey : 27
  },

  events: {

  },

  initialize: function () {
    this.data = [];
    this.$document = $(document);
    this.$window = $(window);
    this.$body = $('body');
    this.$el.html(this.template);
    // this.onInterval = this.onInterval.bind(this);
    this.attach();
  },

  setup: function () {

  },

  attach: function () {
    this.$document.on('keydown', this.onKeydown.bind(this));
    this.$window.on('resize', this.onWindowResize.bind(this));
    this.$window.on('scroll touchmove', function (evt) { evt.preventDefault(); });
    this.$body.on('scroll touchmove', function (evt) { evt.preventDefault(); });
  },

  onWindowResize: function () {

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

  render: function () {

  }
});
