import * as THREE from "three";
import { Boid } from "./Boid";

export interface BoidOptions {
    // Initial boid position
    position: THREE.Vector3;
    // Initial boid velocity
    velocity: THREE.Vector3;
}

export class Doib extends Boid{

    visibilityRange = 40;
    maxSpeed = 0.3;

}