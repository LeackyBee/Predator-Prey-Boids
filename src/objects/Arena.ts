import * as THREE from "three";
import { Bounds3D } from "../Bounds3D";

export class Arena {

    readonly mesh: Array<THREE.Object3D<THREE.Event>> = [];
    private static readonly wallWidth =  0.05 ;

    constructor(dimensions: Bounds3D) {

        const wallTop = new THREE.BoxGeometry(dimensions.xSize + (2 * Arena.wallWidth), dimensions.ySize, Arena.wallWidth);
        const wallBottom = new THREE.BoxGeometry(dimensions.xSize + (2 * Arena.wallWidth), dimensions.ySize, Arena.wallWidth);
        const wallLeft = new THREE.BoxGeometry(Arena.wallWidth, dimensions.ySize, dimensions.zSize);
        const wallRight = new THREE.BoxGeometry(Arena.wallWidth, dimensions.ySize, dimensions.zSize);

        const material = new THREE.MeshBasicMaterial({ color: 0xa48340 });
        material.transparent = true;
        material.opacity = 0.15;

        const material2 = new THREE.MeshBasicMaterial({ color: 0xa49040 });
        material2.transparent = true;
        material2.opacity = 0.15;

        let meshTop = new THREE.Mesh(wallTop, material);
        meshTop.position.set(0, dimensions.ySize / 2, (dimensions.zSize+Arena.wallWidth)/2);

        let meshBottom = new THREE.Mesh(wallBottom, material);
        meshBottom.position.set(0, dimensions.ySize / 2, -(dimensions.zSize+Arena.wallWidth)/2);

        let meshLeft = new THREE.Mesh(wallLeft, material2);
        meshLeft.position.set(-(dimensions.xSize + Arena.wallWidth)/2, dimensions.ySize / 2, 0);

        let meshRight = new THREE.Mesh(wallRight, material2);
        meshRight.position.set((dimensions.xSize + Arena.wallWidth)/2, dimensions.ySize / 2, 0);

        this.mesh.push(meshTop);
        this.mesh.push(meshBottom);
        this.mesh.push(meshLeft);
        this.mesh.push(meshRight);
        
    }

}
