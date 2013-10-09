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

  init();
  loop();

  function init() {
    camera = new THREE.PerspectiveCamera(100, view.w / view.h, 1, 1000);
    camera.position.z = 10;
    scene = new THREE.Scene();
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(view.w, view.h);

    var material = new THREE.ParticleBasicMaterial({ color: new THREE.Color(Math.random() * 0x404040 + 0xaaaaaa, 1)});
    var particle = new THREE.Particle(material);

    particle.position.x = 3;
    particle.position.y = 3;
    particle.position.z = 5;
    particle.offset = {x: 0, y: 0, z: 0};
    particle.shift = {x: 0, y: 0};

   scene.add(particle);

    material = new THREE.ParticleBasicMaterial({ color: new THREE.Color(Math.random() * 0x404040 + 0xaaaaaa, 1)});
    particle = new THREE.Particle(material);

    particle.position.x = -3;
    particle.position.y = -3;
    particle.position.z = 5;
    particle.offset = {x: 0, y: 0, z: 0};
    particle.shift = {x: 0, y: 0};

   scene.add(particle);

    document.body.appendChild(renderer.domElement);
  }

  function loop() {
    renderer.render(scene, camera);

    window.requestAnimationFrame(loop);
  }

})(window.THREE);

