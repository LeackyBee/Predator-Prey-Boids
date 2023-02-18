import * as THREE from "three";
import { StaticObject } from "../SimulationObject";

export class Floor implements StaticObject {
    mesh: THREE.Mesh;

    constructor() {
        const geometry = new THREE.PlaneGeometry(1000, 1000);
        const material = new THREE.MeshBasicMaterial({ color: 0xd4d4d8 });
        this.mesh = new THREE.Mesh(geometry, material);

        // make the plane horizontal
        this.mesh.rotateX(-Math.PI / 2);
    }
}
