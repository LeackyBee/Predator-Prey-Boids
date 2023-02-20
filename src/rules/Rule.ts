import * as THREE from "three";
import { Boid } from "../objects/Boid";

export interface RuleArguments {
    neighbours: Boid[];
}

export abstract class Rule {
    weight: number;

    constructor(weight: number) {
        this.weight = weight;
    }

    abstract calculateVector(thisBoid: Boid, args: RuleArguments): THREE.Vector3;
}
