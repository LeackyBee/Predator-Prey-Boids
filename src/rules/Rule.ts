import * as THREE from "three";
import { Boid } from "../objects/Boid";
import { BoidSimulationParams } from "../BoidSimulation";

export interface RuleArguments {
    neighbours: Boid[];
    simParams: BoidSimulationParams;
}

export abstract class Rule {
    weight: number;

    constructor(weight: number) {
        this.weight = weight;
    }

    abstract calculateVector(thisBoid: Boid, args: RuleArguments): THREE.Vector3;
}
