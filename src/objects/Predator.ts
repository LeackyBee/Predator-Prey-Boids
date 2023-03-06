import * as THREE from "three";
import { Boid, BoidOptions } from "./Boid";


export class Predator extends Boid{

    visibilityRange = 100;
    maxSpeed = 0.1;



    constructor(options: BoidOptions){
        super(options);
        this.baseColour = { h: 0, s: 1, l: 0.5 };
    }

    static fromBoid(boid:Boid){
        return new Predator({position: boid.mesh.position, velocity:boid.velocity, colour:{h:0, s:1, l:0.3}});
    }
}