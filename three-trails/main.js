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

  function init() {
    camera = new THREE.PerspectiveCamera(100, view.w / view.h, 1, 1000);
    camera.position.z = 10;
    scene = new THREE.Scene();
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(view.w, view.h);

    var particle;
    var material;
    for (var i = 0; i < 10; i++) {
      material = new THREE.ParticleBasicMaterial({ color: new THREE.Color(Math.random() * 0x404040 + 0xaaaaaa, 1)});
      particle = new THREE.Particle(material);
      particle.position.x = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 10);
      particle.position.y = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 10);
      particle.position.z = 3;
      particle.offset = {x: 0, y: 0, z: 0};
      particle.shift = {x: 0, y: 0};
      trails.push(particle);
      scene.add(particle);
    }

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('touchstart', onTouch, false);
    document.addEventListener('touchmove', onTouch, false);

    document.body.appendChild(renderer.domElement);
  }

  function loop() {

    for (var i = 0; i < 10; i++) {
      trails[i].position.x += (Math.random() > 0.5 ? 0.1 : -0.1);
      trails[i].position.y += (Math.random() > 0.5 ? 0.1 : -0.1);
      trails[i].position.x += (mouse.x > 0 ? 0.1 : -0.1);
      trails[i].position.y += (mouse.y > 0 ? 0.1 : -0.1);
    }

    renderer.render(scene, camera);

    window.requestAnimationFrame(loop);
  }

})(window.THREE);


