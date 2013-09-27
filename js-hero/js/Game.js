var Game = Backbone.View.extend({
  template:
    '<div class="scene">' +
      '<div class="horizon"></div>' +
    '</div>',

  initialize: function () {
    this.data = [];
    this.$document = $(document);
    this.$window = $(window);
    this.$body = $('body');
    this.$el.html(this.template);
    // this.onInterval = this.onInterval.bind(this);
  }
});
