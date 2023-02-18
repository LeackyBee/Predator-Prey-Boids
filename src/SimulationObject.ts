import * as THREE from "three";

export interface AnimatedObject {
    mesh: THREE.Mesh;
    update(): void;
}

export interface StaticObject {
    mesh: THREE.Mesh;
}
