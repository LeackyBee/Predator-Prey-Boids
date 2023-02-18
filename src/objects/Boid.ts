import * as THREE from "three";
import { AnimatedObject } from "../SimulationObject";

export interface BoidOptions {
    // Initial boid position
    position: THREE.Vector3;
    // Initial boid velocity
    velocity: THREE.Vector3;
}

export class Boid implements AnimatedObject {
    mesh: THREE.Mesh;

    velocity: THREE.Vector3;

    constructor(options: BoidOptions) {
        // model boids as a cone so we can see their direction
        const geometry = new THREE.ConeGeometry(1, 4);
        const material = new THREE.MeshBasicMaterial({ color: 0x1e293b });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(options.position.x, options.position.y, options.position.z);

        this.velocity = options.velocity;
    }

    static generateWithRandomPosAndVel(options?: {
        minXPos?: number;
        maxXPos?: number;
        minYPos?: number;
        maxYPos?: number;
        minZPos?: number;
        maxZPos?: number;
        minXVel?: number;
        maxXVel?: number;
        minYVel?: number;
        maxYVel?: number;
        minZVel?: number;
        maxZVel?: number;
    }): Boid {
        // default position and velocity bounds
        const minXPos = options?.minXPos ?? -50;
        const maxXPos = options?.maxXPos ?? 50;
        const minYPos = options?.minYPos ?? 10;
        const maxYPos = options?.maxYPos ?? 50;
        const minZPos = options?.minZPos ?? -50;
        const maxZPos = options?.maxZPos ?? 50;

        const minXVel = options?.minXVel ?? -0.1;
        const maxXVel = options?.maxXVel ?? 0.1;
        const minYVel = options?.minYVel ?? -0.01;
        const maxYVel = options?.maxYVel ?? 0.01;
        const minZVel = options?.minZVel ?? -0.1;
        const maxZVel = options?.maxZVel ?? 0.1;

        return new Boid({
            position: new THREE.Vector3(
                Math.random() * (maxXPos - minXPos) + minXPos,
                Math.random() * (maxYPos - minYPos) + minYPos,
                Math.random() * (maxZPos - minZPos) + minZPos,
            ),
            velocity: new THREE.Vector3(
                Math.random() * (maxXVel - minXVel) + minXVel,
                Math.random() * (maxYVel - minYVel) + minYVel,
                Math.random() * (maxZVel - minZVel) + minZVel,
            ),
        });
    }

    update() {
        // point the void to face in the direction it's moving
        this.pointInDirection(this.velocity);

        // move the boid by its velocity vector
        this.mesh.position.add(this.velocity);
    }

    /**
     * Point the boid to face in the direction of the given vector
     */
    private pointInDirection(vector: THREE.Vector3) {
        const phi = Math.atan2(-vector.z, vector.x);
        const a = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.z, 2));
        const theta = Math.atan2(a, vector.y);

        // reset the rotation, so we can apply our rotations independent of where
        // we're currently pointed
        this.mesh.rotation.set(0, 0, 0);
        // rotate around the world's z-axis by theta clockwise
        this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -theta);
        // rotate around the world's y-axis by phi anticlockwise
        this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), phi);
    }
}
