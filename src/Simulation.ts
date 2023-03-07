import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class Simulation {
    protected readonly scene: THREE.Scene;
    protected renderer: THREE.WebGLRenderer;
    private readonly camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;

    /**
     * Initialises the scene, renderer, camera, and controls.
     *
     * Adds the scene to the DOM.
     */
    constructor() {
        // initialise scene
        this.scene = new THREE.Scene();
        // set the background colour
        this.scene.background = new THREE.Color(0xf1f5f9);

        // initialise renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // initialise camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            5000,
        );
        this.camera.position.set(120, 80, 120);

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

    /**
     * Add a new object to the scene.
     */
    addToScene(objects: THREE.Object3D<THREE.Event> | Array<THREE.Object3D<THREE.Event>>) {
        if (Array.isArray(objects)) {
            for (const obj of objects) {
                this.scene.add(obj);
            }
        } else {
            this.scene.add(objects);
        }
    }

    removeObjectFromScene(object: THREE.Object3D<THREE.Event>) {
        this.scene.remove(object);
    }
}
