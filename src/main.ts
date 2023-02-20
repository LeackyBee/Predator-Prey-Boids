import "./main.css";
import { BoidSimulation } from "./BoidSimulation";

const simulation = new BoidSimulation();
// this draws a set of axes, to help in development knowing which way is x/y/z
simulation.enableAxesHelper();

animate();

/**
 * The render loop - gets called once per frame to update the scene.
 */
function animate() {
    requestAnimationFrame(animate);
    simulation.update();
}
