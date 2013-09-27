var Game = Backbone.View.extend({
  initialize: function () {
    this.data = [];
    this.$document = $(document);
    this.$window = $(window);
    this.$body = $('body');
    // this.onInterval = this.onInterval.bind(this);
  }
});
