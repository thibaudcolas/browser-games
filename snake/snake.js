(function ($, window) {
  'use strict';

  $(document).ready(function() {
    // Retrieve the canvas' context.
    var ctx = $('#js-snake')[0].getContext('2d');
    ctx.fillStyle = '#fe57a1';
    ctx.fillRect(10, 20, 100, 50);
  });

})($, window);
