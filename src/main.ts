import "./main.css";
import { Simulator } from "./Simulator";
import { Floor } from "./objects/Floor";

const simulator = new Simulator();
simulator.enableAxesHelper();

const floor = new Floor();
simulator.addStaticObject(floor);

// The render loop - gets called once per frame to update the scene
function animate() {
    requestAnimationFrame(animate);
    simulator.update();
}

animate();
