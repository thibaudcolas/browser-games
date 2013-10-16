(function (THREE) {
  'use strict';

  var view = {
    w: window.innerWidth,
    h: window.innerHeight,
    center : {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }
  };

  var mouse = {
    x: 0,
    y: 0
  };

  var camera;
  var scene;
  var renderer;

  var trails = [];

  init();
  loop();

  function onMouseMove(e) {
    mouse.x = e.clientX - view.center.x;
    mouse.y = e.clientY - view.center.y;
  }

  function onTouch(e) {
    if(e.touches.length == 1) {

      e.preventDefault();

      mouse.x = e.touches[0].pageX - view.center.x;
      mouse.y = e.touches[0].pageY - view.center.y;
    }
  }

  function circle(ctx) {
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }

  function init() {
    camera = new THREE.PerspectiveCamera(100, view.w / view.h, 1, 1000);
    camera.position.z = 10;
    scene = new THREE.Scene();
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(view.w, view.h);

    var particle;
    for (var i = 0; i < 100; i++) {
      particle = new THREE.Particle(new THREE.ParticleBasicMaterial({
          color: new THREE.Color(Math.random() * 0x808080 + 0x808080, 1)
      }));
      particle.position.x = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 10);
      particle.position.y = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 10);
      particle.position.z = -10;
      particle.offset = {x: 0, y: 0, z: 0};
      particle.shift = {x: 0, y: 0};
      particle.speed = 0.001 + Math.random() * 0.04;
      particle.radius = (Math.ceil(Math.random() * 20) % 5) * 10;
      console.log(particle.radius);
      trails.push(particle);
      scene.add(particle);
    }

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('touchstart', onTouch, false);
    document.addEventListener('touchmove', onTouch, false);

    document.body.appendChild(renderer.domElement);
  }

  function loop() {

    var particle;
    for (var i = 0; i < 100; i++) {
      particle = trails[i];
      particle.offset.x += particle.speed;
      particle.offset.y += particle.speed;

      particle.shift.x += ( mouse.x - particle.shift.x) * (particle.speed);
      particle.shift.y += ( -mouse.y - particle.shift.y) * (particle.speed);

      particle.position.x = particle.shift.x + Math.cos(i + particle.offset.x) * particle.radius;
      particle.position.y = particle.shift.y + Math.sin(i + particle.offset.y) * particle.radius;
    }

    renderer.render(scene, camera);

    window.requestAnimationFrame(loop);
  }

})(window.THREE);


