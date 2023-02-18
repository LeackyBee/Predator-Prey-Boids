import "./main.css";
import * as THREE from "three";
import { Simulator } from "./Simulator";
import { Floor } from "./objects/Floor";
import { Boid } from "./objects/Boid";

const simulator = new Simulator();
simulator.enableAxesHelper();

const floor = new Floor();
simulator.addStaticObject(floor);

const boid = new Boid({
    position: new THREE.Vector3(0, 5, 0),
    velocity: new THREE.Vector3(0.01, 0.008, -0.011),
});
simulator.addAnimatedObject(boid);

// The render loop - gets called once per frame to update the scene
function animate() {
    requestAnimationFrame(animate);
    simulator.update();
}

animate();
