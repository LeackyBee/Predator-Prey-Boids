import * as THREE from "three";

export interface StaticObject {
    mesh: THREE.Mesh;
}

export interface AnimatedObject extends StaticObject {
    update(): void;
}
