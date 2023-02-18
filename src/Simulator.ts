import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AnimatedObject, StaticObject } from "./SimulationObject";

export class Simulator {
    scene: THREE.Scene;
    renderer: THREE.Renderer;
    camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;

    private animatedObjects: AnimatedObject[] = [];

    /**
     * Initialises the scene, renderer, camera, and controls.
     *
     * Adds the scene to the DOM.
     */
    constructor() {
        // initialise scene
        this.scene = new THREE.Scene();
        // set the background colour
        this.scene.background = new THREE.Color(0xbfe3dd);

        // initialise renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // initialise camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        this.camera.position.set(20, 20, 20);

        // initialise controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.listenToKeyEvents(window);
        // smooth the motion
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        // more natural moving around
        // (right-click and drag to move around)
        this.controls.screenSpacePanning = false;
        // disallow going beneath the floor
        this.controls.maxPolarAngle = Math.PI / 2;

        this.handleWindowResizing();
    }

    /**
     * Set up an event listener to resize the animation to fit the window,
     * whenever the window is resized.
     */
    private handleWindowResizing() {
        // update camera and renderer whenever window size changes
        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    /**
     * Render the scene to the canvas.
     */
    private render() {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Call this method once per animation frame to update the rendering.
     */
    update() {
        this.controls.update();
        this.animatedObjects.map((object) => object.update());
        this.render();
    }

    /**
     * Visualise the three axes
     * - x-axis is red
     * - y-axis is green
     * - z-axis is blue
     */
    enableAxesHelper() {
        const axesHelper = new THREE.AxesHelper(20);
        this.scene.add(axesHelper);
    }

    addAnimatedObject(object: AnimatedObject) {
        this.scene.add(object.mesh);
        this.animatedObjects.push(object);
    }

    /**
     * Add a new object to the scene.
     */
    addStaticObject(object: StaticObject) {
        this.scene.add(object.mesh);
    }
}
