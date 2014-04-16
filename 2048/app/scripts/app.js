'use strict';

angular
  .module('twentyfourtyeightApp', [
    'ngCookies',
    'Game'
  ])
  .controller('GameController', [
    'GameManager',
    function (GameManager) {
    this.game = GameManager;
  }]);
