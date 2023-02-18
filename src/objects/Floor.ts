import * as THREE from "three";
import { StaticObject } from "../SimulationObject";

export class Floor implements StaticObject {
    mesh: THREE.Mesh;
    private readonly material: THREE.MeshBasicMaterial;

    constructor() {
        const geometry = new THREE.PlaneGeometry(200, 200);
        this.material = new THREE.MeshBasicMaterial({ color: 0x333333 });
        this.mesh = new THREE.Mesh(geometry, this.material);

        // make the plane horizontal
        this.mesh.rotation.x = -Math.PI / 2;
    }

    set colour(colour: THREE.Color) {
        this.material.color = colour;
    }
}
