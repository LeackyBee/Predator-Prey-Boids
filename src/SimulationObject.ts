import * as THREE from "three";

export interface StaticObject {
    mesh: THREE.Object3D<THREE.Event>;
}

export interface AnimatedObject extends StaticObject {
    update(): void;
}
