import { Rule, RuleArguments } from "./Rule";
import * as THREE from "three";
import { Boid } from "../objects/Boid";
import { Predator } from "../objects/Predator";

export class PreySeekRule extends Rule {
    readonly name = "Seek Prey Rule";

    private static FILL: number = 100;

    hunger:number = PreySeekRule.FILL;


    targetSwap(thisBoid:Predator, args:RuleArguments){
        let random = Math.random()
        if(random < args.simParams.predNewTargetChance){
            return thisBoid.chooseRandomTarget(args.boids.concat(args.doibs).filter(b => b.isBoidAlive));
        } else{
            return thisBoid.getTarget();
        }
    }

    private getMeanTarget(args:RuleArguments){
        const meanPos = new THREE.Vector3();

        args.boids.concat(args.doibs).forEach(b =>
            meanPos.add(b.position));
        
        return meanPos.divideScalar(args.boids.concat(args.doibs).length)
    }

    calculateVector(thisBoid: Boid, args: RuleArguments): THREE.Vector3 {
        this.hunger--;
        if(!(thisBoid instanceof Predator)){
            return new THREE.Vector3();
        }
        let output = new THREE.Vector3();

        if(this.hunger > 0){
            output = this.getMeanTarget(args);
            return thisBoid.position.clone().sub(output);
        }

        // Decide if we want to swap targets
        let target = this.targetSwap(thisBoid, args);
        thisBoid.setTarget(this.targetSwap(thisBoid, args));
        
        
        
        if(target != null){
            if(target.position.distanceTo(thisBoid.position) < thisBoid.killRange){
                target.kill()
                this.hunger = PreySeekRule.FILL;
                target = null;
            } else if(target.position.distanceTo(thisBoid.position) < thisBoid.huntRange){
                thisBoid.setHunting();
            } else{
                thisBoid.setSeeking();
            }
        }

        if(target != null){
            output.add(target.mesh.position);
            output.sub(thisBoid.mesh.position).normalize();
        }

        return output;
    }   
}
