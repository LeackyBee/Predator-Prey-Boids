import { BoidSimulationParams } from "../BoidSimulation";
import { Boid, BoidOptions } from "./Boid";


export class Predator extends Boid{

    visibilityRange = 100;
    maxSpeed = 1;

    killRange = 10;

    protected target: Boid|null = null;


    constructor(options: BoidOptions){
        super(options);
        this.maxSpeed = options.simParams.predMaxSpeed;
    }

    static fromBoid(boid:Boid, simParams: BoidSimulationParams){
        return new Predator({position: boid.mesh.position, velocity:boid.velocity, colour:{h:0, s:1, l:0.3}, simParams: simParams});
    }

    public setTarget(target:Boid){
        this.target = target;
    }

    public getTarget(){
        return this.target
    }

    public chooseRandomTarget(boids: Boid[]){
        let probabilities: number[] = [];
        let sum = 0;

        
        boids.forEach(b => {
            let prob = 1/this.mesh.position.distanceTo(b.mesh.position)
            sum += prob;
            probabilities.push(prob);
        });

        probabilities = probabilities.map(p => {
            return p/sum;
        })
        
        sum = 0;
        let threshold = Math.random();
        
        for(let i = 0; i < probabilities.length; i++){
            sum += probabilities[i];
            if(sum > threshold){
                return boids[i];
            }
        }
        return boids[boids.length-1]
    }
}