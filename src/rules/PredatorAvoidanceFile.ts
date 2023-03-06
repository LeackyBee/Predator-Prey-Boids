import { Rule, RuleArguments, RuleOptions } from "./Rule";
import { Boid } from "../objects/Boid";
import * as THREE from "three";

export interface PredatorAvoidanceRuleOptions extends RuleOptions {
    sharpness?: number;
}

export class PredatorAvoidanceRule extends Rule {
    readonly name = "Predator Avoidance";

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

    constructor(weight: number, options?: PredatorAvoidanceRuleOptions) {
        super(weight, options);
        this.SHARPNESS = options?.sharpness ?? 3;
    }

    calculateVector(thisBoid: Boid, args: RuleArguments): THREE.Vector3 {
        const predatorAvoidVector = new THREE.Vector3();
        const predRange = thisBoid.predatorRange;

        for (const neighbour of args.neighbours) {
            const dist = thisBoid.position.distanceTo(neighbour.position);

            const avoidanceMagnitude = Math.pow(this.SHARPNESS, -dist);

            
        }

        predatorAvoidVector.multiplyScalar(this.weight);
        return predatorAvoidVector;
    }
}
