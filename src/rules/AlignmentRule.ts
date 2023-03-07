import { Rule, RuleArguments } from "./Rule";
import * as THREE from "three";
import { Boid } from "../objects/Boid";

export class AlignmentRule extends Rule {
    readonly name = "Alignment";

    calculateVector(_thisBoid: Boid, args: RuleArguments): THREE.Vector3 {
        // no alignment force if there are no visible neighbours
        if (args.neighbours.length === 0) {
            return new THREE.Vector3();
        }

        const alignment = new THREE.Vector3();

        for (const neighbour of args.neighbours) {
            alignment.add(neighbour.actualVelocity);
        }
        alignment.divideScalar(args.neighbours.length);

        alignment.normalize();
        alignment.multiplyScalar(this.weight);

        return alignment;
    }
}
