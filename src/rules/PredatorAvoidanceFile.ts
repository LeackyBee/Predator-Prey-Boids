import { Rule, RuleArguments, RuleOptions } from "./Rule";
import { Boid } from "../objects/Boid";
import * as THREE from "three";

export interface PredatorAvoidanceRuleOptions extends RuleOptions {
    sharpness?: number;
}

export class PredatorAvoidanceRule extends Rule {
    readonly name = "Predator Avoidance Rule";

    private readonly SHARPNESS;

    private readonly SCARE_TIMER_RESET = 120;

    private scareTimer = this.SCARE_TIMER_RESET;

    constructor(weight: number, options?: PredatorAvoidanceRuleOptions) {
        super(weight, options);
        this.SHARPNESS = options?.sharpness ?? 3;
    }

    calculateVector(thisBoid: Boid, args: RuleArguments): THREE.Vector3 {
        this.scareTimer--;
        if(this.scareTimer == 0){
            thisBoid.calm();
        }
        const predatorAvoidVector = new THREE.Vector3();
        
        args.predators.forEach(p => {
            if(thisBoid.position.distanceTo(p.position)< thisBoid.predatorRange){
                thisBoid.scare();
                predatorAvoidVector.add(thisBoid.position.clone().sub(p.position))
            }
        });

        predatorAvoidVector.multiplyScalar(this.weight);
        return predatorAvoidVector;
    }
}
