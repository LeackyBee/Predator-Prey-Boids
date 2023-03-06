import * as THREE from "three";
import { Bounds3D } from "../Bounds3D";

export class Arena {

    readonly mesh: Array<THREE.Object3D<THREE.Event>> = [];
    private static readonly wallWidth =  5;
    private static readonly seaGap =  10;

    constructor(dimensions: Bounds3D) {

        const wallTop = new THREE.BoxGeometry(dimensions.xSize + (2 * Arena.wallWidth), dimensions.ySize - Arena.seaGap, Arena.wallWidth);
        const wallBottom = new THREE.BoxGeometry(dimensions.xSize + (2 * Arena.wallWidth), dimensions.ySize - Arena.seaGap, Arena.wallWidth);
        const wallLeft = new THREE.BoxGeometry(Arena.wallWidth, dimensions.ySize - Arena.seaGap, dimensions.zSize);
        const wallRight = new THREE.BoxGeometry(Arena.wallWidth, dimensions.ySize - Arena.seaGap, dimensions.zSize);

        const material = new THREE.MeshBasicMaterial({ color: 0xa49040 }); // 0xa48340
        material.transparent = true;
        material.opacity = 0.15;

        let lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );

        let meshTop = new THREE.Mesh(wallTop, material);
        meshTop.position.set(0, (dimensions.ySize + Arena.seaGap) / 2, (dimensions.zSize + Arena.wallWidth) / 2);

        let meshBottom = new THREE.Mesh(wallBottom, material);
        meshBottom.position.set(0, (dimensions.ySize + Arena.seaGap) / 2, -(dimensions.zSize + Arena.wallWidth) / 2);

        let meshLeft = new THREE.Mesh(wallLeft, material);
        meshLeft.position.set(-(dimensions.xSize + Arena.wallWidth) / 2, (dimensions.ySize + Arena.seaGap) / 2, 0);

        let meshRight = new THREE.Mesh(wallRight, material);
        meshRight.position.set((dimensions.xSize + Arena.wallWidth) / 2, (dimensions.ySize + Arena.seaGap) / 2, 0);

        this.mesh.push(meshTop);
        this.mesh.push(meshBottom);
        this.mesh.push(meshLeft);
        this.mesh.push(meshRight);

        let wireframeTop = new THREE.LineSegments(new THREE.EdgesGeometry(meshTop.geometry), lineMaterial);
        wireframeTop.position.set(0, (dimensions.ySize + Arena.seaGap) / 2, (dimensions.zSize + Arena.wallWidth) / 2);

        let wireframeBottom = new THREE.LineSegments(new THREE.EdgesGeometry(meshBottom.geometry), lineMaterial);
        wireframeBottom.position.set(0, (dimensions.ySize + Arena.seaGap) / 2, -(dimensions.zSize + Arena.wallWidth) / 2);

        let wireframeLeft = new THREE.LineSegments(new THREE.EdgesGeometry(meshLeft.geometry), lineMaterial);
        wireframeLeft.position.set(-(dimensions.xSize + Arena.wallWidth) / 2, (dimensions.ySize + Arena.seaGap) / 2, 0);

        let wireframeRight = new THREE.LineSegments(new THREE.EdgesGeometry(meshRight.geometry), lineMaterial);
        wireframeRight.position.set((dimensions.xSize + Arena.wallWidth) / 2, (dimensions.ySize + Arena.seaGap) / 2, 0);

        this.mesh.push(wireframeTop);
        this.mesh.push(wireframeBottom);
        this.mesh.push(wireframeLeft);
        this.mesh.push(wireframeRight);

    }

}
