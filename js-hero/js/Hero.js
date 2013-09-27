var Hero = Backbone.View.extend({
  initialize: function () {
    this.$body = $('body');
    this.build();
  },

  build: function () {
    if (this.browserSupportsTouch()) {
      console.log('supports touch');
    }

    this.game = new Game({
      el: $('.game')
    });

    _.defer(function (that) {
      that.game.start();
    }, this);
  },

  browserSupportsTouch: function () {
    try {
      document.createEvent("TouchEvent");
      return true;
    }
    catch (e) {
      return false;
    }
  }
});
