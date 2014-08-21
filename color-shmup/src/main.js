var raf = require('./raf');
var rand = require('./rng')();
var kd = require('./keydrown');

var canvas = document.querySelector('#game');
var ctx = canvas.getContext('2d');

var colors = [
  '#0074D9', '#2ECC40', '#FF4136', '#FFDC00'
];

var balls = [];
var player = {};

var reset = function () {
  player = {
    x: canvas.width/2,
    y: rand.int(canvas.height / 2),
    radius: rand.range(50, 60),
    dx: rand.range(-100, 100),
    dy: 0,
    color: rand.pick(colors)
  };

  balls = [];

  for (var i = 0; i < 10; i++) {
    balls.push({
      x: rand.int(canvas.width),
      y: rand.int(canvas.height / 2),
      radius: rand.range(15, 35),
      dx: rand.range(-100, 100),
      dy: 0,
      color: rand.pick(colors)
    });
  }
};

reset();

raf.start(function (elapsed) {
  kd.tick();

  // Clear the screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update each balls
  balls.forEach(function(ball) {
    // Gravity
    ball.dy += elapsed * 1500;

    // Handle collision against the canvas's edges
    if (ball.x - ball.radius < 0 && ball.dx < 0 || ball.x + ball.radius > canvas.width && ball.dx > 0) ball.dx = -ball.dx * 0.7;
    if (ball.y - ball.radius < 0 && ball.dy < 0 || ball.y +  ball.radius > canvas.height && ball.dy > 0) ball.dy = -ball.dy * 0.7;

    // Update ball position
    ball.x += ball.dx * elapsed;
    ball.y += ball.dy * elapsed;

    // Render the ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = ball.color;
    ctx.fill();
  });

  // Gravity
  // player.dy += elapsed * 1500;

  // Handle collision against the canvas's edges
  if (player.x - player.radius < 0 && player.dx < 0 || player.x + player.radius > canvas.width && player.dx > 0) player.dx = -player.dx * 0.7;
  if (player.y - player.radius < 0 && player.dy < 0 || player.y +  player.radius > canvas.height && player.dy > 0) player.dy = -player.dy * 0.7;

  // Update player position
  player.x += player.dx * elapsed;
  player.y += player.dy * elapsed;

  // Render the player
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fillStyle = player.color;
  ctx.fill();
});

kd.SPACE.down(function () {
  console.log('SPACE');

  player.color = rand.pick(colors);
});

kd.UP.down(function () {
  console.log('UP');
  player.dy -= 20;
});

kd.DOWN.down(function () {
  console.log('DOWN');
  player.dy += 20;
});

kd.LEFT.down(function () {
  console.log('LEFT');
  player.dx -= 20;
});

kd.RIGHT.down(function () {
  console.log('RIGHT');
  player.dx += 50;
});

kd.ESC.down(function () {
  console.log('ESC');
  reset();
});
