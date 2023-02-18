import "./main.css";
import { Simulator } from "./Simulator";
import { Floor } from "./objects/Floor";
import { Boid } from "./objects/Boid";
import { GUI } from "dat.gui";

const params = {
    boidCount: 20,
    generateBoids,
    reset,
};

const simulator = new Simulator();
// this draws a set of axes, to help in development knowing which way is x/y/z
simulator.enableAxesHelper();

const floor = new Floor();
simulator.addStaticObject(floor);

generateBoids();

initParamsGui();

animate();

/**
 * Sets up the GUI for adjusting parameters.
 */
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

/**
 * Generates random boids. The number of boids to generate is set by
 * `params.boidCount`.
 */
function generateBoids() {
    for (let i = 0; i < params.boidCount; i++) {
        const boid = Boid.generateWithRandomPosAndVel();
        simulator.addAnimatedObject(boid);
    }
}

/**
 * Resets the simulation by removing all boids.
 */
function reset() {
    simulator.resetAnimatedObjects();
}

/**
 * The render loop - gets called once per frame to update the scene.
 */
function animate() {
    requestAnimationFrame(animate);
    simulator.update();
}
