import "./main.css";
import * as THREE from "three";
import { Simulator } from "./Simulator";
import { Floor } from "./objects/Floor";
import { Boid } from "./objects/Boid";
import { GUI } from "dat.gui";

const params = {
    boidCount: 20,
    generateBoids: generateBoids,
    reset: reset,
};

const simulator = new Simulator();
simulator.enableAxesHelper();

const floor = new Floor();
simulator.addStaticObject(floor);

generateBoids();

initParamsGui();

animate();

function initParamsGui() {
    // Interface for controlling parameters
    const gui = new GUI({
        hideable: false,
    });

    const generateNewBoidsFolder = gui.addFolder("Generate new boids");

    generateNewBoidsFolder.add(params, "boidCount", 10, 100).name("Count");
    generateNewBoidsFolder.add(params, "generateBoids").name("Generate boids");
    gui.add(params, "reset").name("Delete all boids");
}

function generateBoids() {
    for (let i = 0; i < params.boidCount; i++) {
        const boid = new Boid({
            position: new THREE.Vector3(
                Math.random() * 50 - 25,
                Math.random() * 40 + 10,
                Math.random() * 50 - 25,
            ),
            velocity: new THREE.Vector3(0, 0, 0),
        });
        simulator.addAnimatedObject(boid);
    }
}

function reset() {
    simulator.resetAnimatedObjects();
}

// The render loop - gets called once per frame to update the scene
function animate() {
    requestAnimationFrame(animate);
    simulator.update();
}
