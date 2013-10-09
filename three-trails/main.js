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
    camera = new THREE.PerspectiveCamera(75, view.w / view.h, 0.1, 1000);
    scene = new THREE.Scene();
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(view.w, view.h);

    camera.position.z = 50;

    var mat = new THREE.ParticleBasicMaterial({color: new THREE.Color(Math.random() * 0x404040 + 0xaaaaaa, 1), size: 3});
    var particle = new THREE.Particle(mat);

    //particle.position.x = 3;
    //particle.position.y = 3;
    //particle.position.z = 5;
    //particle.offset = { x: 0, y: 0, z: 0 };
    //particle.shift = { x: 0, y: 0 };
    //particle.speed = 0.01+Math.random()*0.04;
    //particle.targetSize = 10;

   scene.add(particle);

    document.body.appendChild(renderer.domElement);
  }

  function loop() {
    //camera.updateMatrix();
    renderer.render(scene, camera);

    window.requestAnimationFrame(loop);
  }

})(window.THREE);

