var raf = require('./raf');
var rng = require('./rng');
var kd = require('./keydrown');

var canvas = document.querySelector('#game');
var ctx = canvas.getContext('2d');

var rand = rng();

var balls = [];
var colors = [
  '#7FDBFF', '#0074D9', '#01FF70', '#001F3F', '#39CCCC',
  '#3D9970', '#2ECC40', '#FF4136', '#85144B', '#FF851B',
  '#B10DC9', '#FFDC00', '#F012BE',
];

for (var i = 0; i < 50; i++) {
  balls.push({
    x: rand.int(canvas.width),
    y: rand.int(canvas.height / 2),
    radius: rand.range(15, 35),
    dx: rand.range(-100, 100),
    dy: 0,
    color: rand.pick(colors)
  });
}

raf.start(function(elapsed) {
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
});

kd.SPACE.down(function () {
  console.log('SPACE');

  balls.forEach(function(ball) {
    ball.dy -= 100;
  });
});

kd.UP.down(function () {
  console.log('UP');
});

kd.DOWN.down(function () {
  console.log('DOWN');
});

kd.LEFT.down(function () {
  console.log('LEFT');
});

kd.RIGHT.down(function () {
  console.log('RIGHT');
});

kd.ESC.down(function () {
  console.log('ESC');
});
