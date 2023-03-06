import * as THREE from "three";
import { Boid, BoidOptions } from "./Boid";


export class Doib extends Boid{

    visibilityRange = 40;
    maxSpeed = 0.3;


    constructor(options: BoidOptions){
        super(options);
    }

    static fromBoid(boid:Boid){
        return new Doib({position: boid.mesh.position, velocity:boid.velocity, colour: {h:0.34, s:1.0, l:0.3}});
    }

}