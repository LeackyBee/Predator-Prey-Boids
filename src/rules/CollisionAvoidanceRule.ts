import { Rule, RuleArguments } from "./Rule";
import { Boid } from "../objects/Boid";
import * as THREE from "three";

export class CollisionAvoidanceRule extends Rule {
    /**
     * How "aggressive" the collision avoidance should be.
     * Higher values will allow the boids to be closer together, and will produce
     * snappier changes in direction to avoid each other.
     *
     * Controls the steepness of the curve of the exponential weighting of distance.
     *
     * Min value: 1
     */
    private readonly SHARPNESS;

    constructor(weight: number, sharpness?: number) {
        super(weight);
        this.SHARPNESS = sharpness ?? 3;
    }

    calculateVector(thisBoid: Boid, args: RuleArguments): THREE.Vector3 {
        const collisionAvoidVector = new THREE.Vector3();

        for (const neighbour of args.neighbours) {
            const dist = thisBoid.position.distanceTo(neighbour.position);

            const avoidanceMagnitude = Math.pow(this.SHARPNESS, -dist);

            const neighbourAvoidVector = new THREE.Vector3();
            neighbourAvoidVector.subVectors(thisBoid.position, neighbour.position);
            neighbourAvoidVector.setLength(avoidanceMagnitude);

            collisionAvoidVector.add(neighbourAvoidVector);
        }

        collisionAvoidVector.multiplyScalar(this.weight);
        return collisionAvoidVector;
    }
}
