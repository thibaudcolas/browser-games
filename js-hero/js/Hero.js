var Hero = Backbone.View.extend({
  initialize: function () {

    this.model = new Backbone.Model({
      start: new Date(),
      score: 0,
      hits: 0
    });

    this.$body = $('body');
    this.build();
    this.attach();
  },

  build: function () {
    if (this.browserSupportsTouch()) {
      console.log('supports touch');
    }

    this.game = new Game({
      el: $('.game')
    });

    this.scoreBar = new ScoreBar({
      el: $('.score-bar'),
      model: this.model
    });

    _.defer(function (that) {
      that.game.start();
    }, this);
  },

  attach: function () {
    this.listenTo(this.game, 'score', this.onGameScore);
  },

  onGameScore: function (evt) {
    this.model.set({
      score: this.model.get('score') + evt.score,
      hits: this.model.get('hits') + 1
    });
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
