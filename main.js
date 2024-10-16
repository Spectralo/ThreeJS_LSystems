import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Scene setup

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setAnimationLoop(animate);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000,
);

const controls = new OrbitControls(camera, renderer.domElement);

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(0, 20, 100);
controls.update();

const scene = new THREE.Scene();
const material = new THREE.LineBasicMaterial({ color: 0xffffff });

// Generate L system

// important vars
let rules = {
  F: "FF",
  X: "F-[[X]+X]+F[+FX]-X",
};
let axiom = "X";
let sentence = axiom;
let len = 1;
let angle = 25;
let posx = 0;
let posy = -140;
let NextAngle = 25;
let savePos = [];
let line;
let limit = 1000;

//generate function

function generate() {
  if (sentence.length > limit) {
    return;
  } else {
    console.log("hey");
    sentence.split("").forEach((char) => {
      if (rules[char]) {
        sentence = sentence.replaceAll(char, rules[char]);
      } else {
        sentence = sentence.replaceAll(char, char);
      }
    });
  }
}

//now time to generate the sentence

document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sentence = axiom;
    generate();
    generate();
    posx = -0;
    posy = -30;
    NextAngle = 0;
    scene.remove(line);
    draw();
  }
});

// Draw the L system

function draw() {
  const points = [];
  points.push(new THREE.Vector3(posx, posy, 0));
  sentence.split("").forEach((char) => {
    if (char === "F") {
      posy += len * Math.cos((NextAngle * Math.PI) / 180);
      posx += len * Math.sin((NextAngle * Math.PI) / 180);
      points.push(new THREE.Vector3(posx, posy, 0));
    } else if (char === "+") {
      NextAngle += angle;
    } else if (char === "-") {
      NextAngle -= angle;
    } else if (char === "[") {
      savePos.push([posx, posy, NextAngle]);
    } else if (char === "]") {
      const [x, y, a] = savePos.pop();
      posx = x;
      posy = y;
      NextAngle = a;
    }
  });
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  line = new THREE.Line(geometry, material);
}

function animate() {
  try {
    scene.add(line);
  } catch (e) {
    console.log(e);
  }
  renderer.render(scene, camera);
  controls.update();
}
