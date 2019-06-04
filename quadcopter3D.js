/*jshint esversion: 6 */
// @ts-check

/**
 * Minimal Starter Code for the QuadCopter assignment
 */

import { onWindowOnload } from "./Libs/helpers.js";

// these four lines fake out TypeScript into thinking that THREE
// has the same type as the T.js module, so things work for type checking
// type inferencing figures out that THREE has the same type as T
// and then I have to use T (not THREE) to avoid the "UMD Module" warning
/**  @type typeof import("./THREE/threets/index"); */
let T;
// @ts-ignore
T = THREE;

function quadcopter() {
    let renderer = new T.WebGLRenderer();
    renderer.setSize(600, 400);
    document.body.appendChild(renderer.domElement);

    let scene = new T.Scene();
    let camera = new T.PerspectiveCamera(40, renderer.domElement.width / renderer.domElement.height, 1, 1000);

    //camera.position.z = 10;
    camera.position.z = 10;
    camera.position.y = 5;
    //camera.position.x = 5;
    camera.position.x = 10;

    camera.lookAt(0, 0, 0);

    // since we're animating, add OrbitControls
    let controls = new T.OrbitControls(camera, renderer.domElement);

    scene.add(new T.AmbientLight("white", 0.2));

    // two lights - both a little off white to give some contrast
    let dirLight1 = new T.DirectionalLight(0xF0E0D0, 1);
    dirLight1.position.set(1, 1, 0);
    scene.add(dirLight1);

    let dirLight2 = new T.DirectionalLight(0xD0E0F0, 1);
    dirLight2.position.set(-1, 1, -.2);
    scene.add(dirLight2);

    // make a ground plane
    let groundBox = new T.BoxGeometry(10, 0.1, 10);
    let groundMesh = new T.Mesh(groundBox, new T.MeshStandardMaterial({ color: 0x88B888, roughness: .9 }));
    // put the top of the box at the ground level (0)
    groundMesh.position.y = -.05;
    scene.add(groundMesh);

    var geometry = new T.BoxGeometry(1.5, 0.1, 0.1);
    var material = new T.MeshBasicMaterial({ color: "grey" });
    var body = [];
    for (var i = 1; i <= 4; i++) {
        body[i] = new T.Mesh(geometry, material);
    }
    body[1].position.y = 2;
    body[2].rotation.y = Math.PI / 2;
    body[2].position.y = 2;

    body[3].position.y = 3;
    body[3].position.x = 3;

    body[4].rotation.y = Math.PI / 2;
    body[4].position.y = 3;
    body[4].position.x = 3;

    //the wings
    var geometryPropellers = new T.BoxGeometry(0.8, 0.05, 0.05);
    var frontPropellers = new T.BoxGeometry(0.1, 0.2, 0.1);

    var materialPropellers = new T.MeshBasicMaterial({ color: "red" });
    var propellers = [];
    for (var i = 1; i <= 4; i++) {
        propellers[i] = new T.Mesh(geometryPropellers, materialPropellers);
        propellers[i].position.y = 2.1;
    }
    var front1 = new T.Mesh(frontPropellers, materialPropellers);
    front1.position.y = 2;
    front1.position.x = - 0.45;

    var front2 = new T.Mesh(frontPropellers, materialPropellers);
    front2.position.y = 3;
    front2.position.x = 2.55;

    var propellers2 = [];
    for (var i = 1; i <= 4; i++) {
        propellers2[i] = new T.Mesh(geometryPropellers, materialPropellers);
        propellers2[i].position.y = 3.1;
    }

    //wing 1
    propellers[1].position.z = 0.75;

    //wing2
    propellers[2].rotation.y = Math.PI / 2;
    propellers[2].position.x = 0.75;

    //wing3
    propellers[3].position.z = - 0.75;

    //wing4
    propellers[4].rotation.y = Math.PI / 2;
    propellers[4].position.x = -0.75;

    //second one
    //wing 1
    propellers2[1].position.z = 0.75;
    propellers2[1].position.x = 3;


    //wing2
    propellers2[2].rotation.y = Math.PI / 2;
    //propellers2[2].position.x = 0.75;
    propellers2[2].position.x = 3.75;


    //wing3
    propellers2[3].position.z = - 0.75;
    propellers2[3].position.x = 3;


    //wing4
    propellers2[4].rotation.y = Math.PI / 2;
    propellers2[4].position.x = 2.25;

    var quadcopter1 = new T.Group();
    var quadcopter2 = new T.Group();

    for (var i = 1; i <= 4; i++) {
        quadcopter1.add(propellers[i]);
    }
    quadcopter1.add(body[1]);
    quadcopter1.add(body[2]);
    quadcopter1.add(front1);
    scene.add(quadcopter1);

    var geometryCone = new T.ConeGeometry(0.5, 1, 10);
    var materialCone = new T.MeshBasicMaterial({ color: 0xffff00 });
    var cone = new T.Mesh(geometryCone, materialCone);

    quadcopter2.add(body[3]);
    quadcopter2.add(body[4]);
    for (var i = 1; i <= 4; i++) {
        quadcopter2.add(propellers2[i]);
    }
    quadcopter2.add(front2);

    scene.add(quadcopter2);

    function animateLoop() {

        let theta1 = performance.now() / 50;
        for (var i = 1; i <= 4; i++) {
            propellers[i].rotation.y = theta1;
            propellers2[i].rotation.y = theta1;
        }

        let theta = performance.now() / 1000;
        let theta2 = performance.now() / 500;

        quadcopter1.rotation.y = -theta;
        quadcopter2.rotation.y = -theta2;


        let q1x = 3 * Math.cos(theta);
        let q1z = 3 * Math.sin(theta);



        let q2x = 3 * Math.cos(theta2);
        let q2z = 3 * Math.sin(theta2);


        quadcopter1.position.x = q1x;
        quadcopter1.position.z = q1z;

        quadcopter2.position.x = q2x;
        quadcopter2.position.z = q2z;

        cone.lookAt(quadcopter1.position);
        cone.rotateX(Math.PI/2);

        renderer.render(scene, camera);
        window.requestAnimationFrame(animateLoop);
    }
    animateLoop();
}
onWindowOnload(quadcopter);
