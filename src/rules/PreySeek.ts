import { Rule, RuleArguments } from "./Rule";
import * as THREE from "three";
import { Boid } from "../objects/Boid";
import { Predator } from "../objects/Predator";

export class PreySeekRule extends Rule {
    readonly name = "Prey Seek";

    calculateVector(thisBoid: Boid, args: RuleArguments): THREE.Vector3 {
        if(!(thisBoid instanceof Predator)){
            return new THREE.Vector3();
        }
        let output = new THREE.Vector3();
        
        
        let target = thisBoid.getTarget();
        if(target != null){
            if(target.position.distanceTo(thisBoid.position) < thisBoid.killRange){
                
            }

            let random = Math.random()
            if(random < args.simParams.predNewTargetChance){
                target = thisBoid.chooseRandomTarget(args.boids.concat(args.doibs))
                thisBoid.setTarget(target);
            }
            output.add(target.mesh.position);
            output.sub(thisBoid.mesh.position).normalize();
        } else{
            let random = Math.random()
            if(random < args.simParams.predNewTargetChance){
                target = thisBoid.chooseRandomTarget(args.boids.concat(args.doibs))
                thisBoid.setTarget(target);
                output.add(target.mesh.position);
                output.sub(thisBoid.mesh.position).normalize();
            }
        }

        return output;

    }
}
