import { Rule, RuleArguments } from "./Rule";
import * as THREE from "three";
import { Boid } from "../objects/Boid";

export class SeparationRule extends Rule {
    readonly name = "Separation";

    calculateVector(thisBoid: Boid, args: RuleArguments): THREE.Vector3 {
        const separation = new THREE.Vector3();

        for (const neighbour of args.neighbours) {
            const diff = new THREE.Vector3();
            diff.subVectors(thisBoid.position, neighbour.position);
            separation.add(diff);
        }

        separation.normalize();
        separation.multiplyScalar(this.weight);

        return separation;
    }
}
