import { Rule, RuleArguments } from "./Rule";
import { Boid } from "../objects/Boid";
import * as THREE from "three";

export class CollisionAvoidanceRule extends Rule {
    private static readonly DISTANCE_THRESHOLD = 4;

    calculateVector(thisBoid: Boid, args: RuleArguments): THREE.Vector3 {
        const collisionAvoidVector = new THREE.Vector3();

        for (const neighbour of args.neighbours) {
            const dist = thisBoid.position.distanceTo(neighbour.position);
            if (dist > CollisionAvoidanceRule.DISTANCE_THRESHOLD) {
                continue;
            }

            const avoidanceMagnitude = Math.exp(-dist);

            const neighbourAvoidVector = new THREE.Vector3();
            neighbourAvoidVector.subVectors(thisBoid.position, neighbour.position);
            neighbourAvoidVector.setLength(avoidanceMagnitude);

            collisionAvoidVector.add(neighbourAvoidVector);
        }

        collisionAvoidVector.multiplyScalar(this.weight);
        return collisionAvoidVector;
    }
}
