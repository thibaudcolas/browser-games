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


    var geometry = new THREE.CubeGeometry(1,1,1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;

    document.body.appendChild(renderer.domElement);
  }

  function loop() {
    camera.updateMatrix();
    renderer.render(scene, camera);

    window.requestAnimationFrame(loop);
  }

})(window.THREE);
