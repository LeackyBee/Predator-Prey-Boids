import { Simulation } from "./Simulation";
import { Boid } from "./objects/Boid";
import { GUI } from "dat.gui";
import { Floor } from "./objects/Floor";
import { SeparationRule } from "./rules/SeparationRule";
import { CohesionRule } from "./rules/CohesionRule";
import { AlignmentRule } from "./rules/AlignmentRule";
import { Bounds3D } from "./Bounds3D";
import { WorldBoundaryRule } from "./rules/WorldBoundaryRule";
import { CollisionAvoidanceRule } from "./rules/CollisionAvoidanceRule";
import { Arena } from "./objects/Arena";
import { Water } from "./objects/Water";
import { Sky } from "./objects/Sky";
import * as THREE from "three";
import { SunParams } from "./objects/Sun";
import { ShaderMaterial } from "three";
import { Doib } from "./objects/Doib";
import { Predator } from "./objects/Predator";
import { PreySeekRule } from "./rules/PreySeek";

export interface BoidSimulationParams {
    boidCount: number;
    boidMaxSpeed: number;
    visibilityThreshold: number;
    doibMaxSpeed: number;
    acceleration: number;
    worldDimens: Bounds3D;
    photorealisticRendering: boolean;
    randomnessPerTimestep: number;
    randomnessLimit: number;
    predNewTargetChance: number;
}

export class BoidSimulation extends Simulation {
    controlsGui: GUI;

    boids: Boid[] = [];
    doibs: Doib[] = [];
    predators: Predator[] = [];

    simParams: BoidSimulationParams = {
        boidCount: 50,
        boidMaxSpeed: 0.5,
        doibCount: 50,
        doibMaxSpeed: 0.4,
        predCount: 2,
        predMaxSpeed: 1,
        visibilityThreshold: 50,
        maxSpeed: 0.5,
        acceleration: 0.01,
        worldDimens: Bounds3D.centredXZ(200, 200, 100),
        photorealisticRendering: false,
        randomnessPerTimestep: 0.01,
        randomnessLimit: 0.1,
        predNewTargetChance: 0.3,
    };

    boidRules = [
        new SeparationRule(0.8),
        new CohesionRule(1),
        new AlignmentRule(1),
        new WorldBoundaryRule(10),
        new CollisionAvoidanceRule(10),
        new PredatorAvoidanceRule(10),
    ];

    doibRules = [
        new SeparationRule(0.8),
        new CohesionRule(1),
        new AlignmentRule(1),
        new WorldBoundaryRule(10),
        new CollisionAvoidanceRule(10),
    ];

    predRules = [
        new PreySeekRule(10),
    ]

    private readonly floor?: Floor;
    private water?: Water;
    private sky?: Sky;
    private sun?: THREE.Vector3;
    private generator?: THREE.PMREMGenerator;
    private renderTarget?: THREE.WebGLRenderTarget;

    constructor(params?: BoidSimulationParams) {
        super();

        if (params) {
            this.simParams = params;
        }

        // init controls GUI
        this.controlsGui = new GUI({
            hideable: false,
        });
        this.controlsGui.add(this.simParams, "boidCount", 10, 200).name("Boid count");
        this.controlsGui.add(this.simParams, "doibCount", 10, 200).name("Doib count");
        this.controlsGui.add(this.simParams, "predCount", 1, 5).name("Predator count");

        // controls to change level of randomness
        const randomnessGui = this.controlsGui.addFolder("Randomness");
        randomnessGui.open();
        randomnessGui
            .add(this.simParams, "randomnessPerTimestep", 0, 0.02, 0.001)
            .name("Per timestep");
        randomnessGui.add(this.simParams, "randomnessLimit", 0, 0.5, 0.01).name("Limit");

        // controls to change rule weights
        const boidRuleWeightsGui = this.controlsGui.addFolder("Boid Options (Blue)");
        boidRuleWeightsGui.open();
        for (const rule of this.boidRules) {
            boidRuleWeightsGui.add(rule, "weight", rule.minWeight, rule.maxWeight, 0.1).name(rule.name);
        }

        // controls to change level of randomness
        const doibRuleWeightGui = this.controlsGui.addFolder("Doib Options (Green)");
        doibRuleWeightGui.open();
        for (const rule of this.doibRules) {
            doibRuleWeightGui.add(rule, "weight", rule.minWeight, rule.maxWeight, 0.1).name(rule.name);
        }

        const predRuleWeightGui = this.controlsGui.addFolder("Predator Options (Red)");
        predRuleWeightGui.open();
        for (const rule of this.predRules) {
            predRuleWeightGui.add(rule, "weight", rule.minWeight, rule.maxWeight, 0.1).name(rule.name);
        }

        // add a floor to the simulation
        if (!this.simParams.photorealisticRendering) {
            this.floor = new Floor();
            this.addToScene(this.floor.mesh);
        }

        const arena = new Arena(this.simParams);
        this.addToScene(arena.mesh);

        if (this.simParams.photorealisticRendering) {
            this.initializePhotorealisticRendering();
        }
    }

    initializePhotorealisticRendering() {
        // Sun
        this.sun = new THREE.Vector3();

        // Water
        const waterGeometry = new THREE.PlaneGeometry(10_000, 10_000);

        this.water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load(
                "textures/waternormals.jpg",
                function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                },
            ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: true,
        });

        this.water.rotation.x = -Math.PI / 2;
        this.addToScene(this.water);

        // Sky
        this.sky = new Sky();
        this.sky.scale.setScalar(10_000);
        this.addToScene(this.sky);

        if (this.sky.material instanceof ShaderMaterial) {
            const skyUniforms = this.sky.material.uniforms;
            skyUniforms["turbidity"].value = 10;
            skyUniforms["rayleigh"].value = 2;
            skyUniforms["mieCoefficient"].value = 0.005;
            skyUniforms["mieDirectionalG"].value = 0.8;
        }

        this.generator = new THREE.PMREMGenerator(this.renderer);
        this.updateSun();
    }

    updateSun() {
        if (!this.simParams.photorealisticRendering)
            throw new Error("Photorealistic rendering is disabled.");
        if (
            this.sun === undefined ||
            this.sky === undefined ||
            this.water === undefined ||
            this.generator === undefined
        ) {
            throw new Error("One or more photorealistic rendering variables are undefined.");
        }

        const phi = THREE.MathUtils.degToRad(90 - SunParams.elevation);
        const theta = THREE.MathUtils.degToRad(SunParams.azimuth);

        this.sun.setFromSphericalCoords(1, phi, theta);

        if (this.sky.material instanceof ShaderMaterial) {
            this.sky.material.uniforms["sunPosition"].value.copy(this.sun);
        }

        if (this.water.material instanceof ShaderMaterial) {
            this.water.material.uniforms["sunDirection"].value.copy(this.sun).normalize();
        }

        if (this.renderTarget !== undefined) {
            this.renderTarget.dispose();
        }

        this.renderTarget = this.generator.fromScene(this.scene);
        this.scene.environment = this.renderTarget.texture;
    }

    update() {
        // update boids before updating base simulation to rerender
        this.updateBoidCount();

        this.boids.map((boid) =>
            // boid.update(this.getBoidNeighbours(boid), this.steeringForceCoefficients),
            boid.update(this.boidRules, {
                neighbours: this.getBoidNeighbours(boid),
                simParams: this.simParams,
                boids: this.boids,
                doibs: this.doibs,
                predators: this.predators,
            }),
        );

        this.doibs.map((doib) =>
        // boid.update(this.getBoidNeighbours(boid), this.steeringForceCoefficients),
        doib.update(this.doibRules, {
            neighbours: this.getBoidNeighbours(doib),
            simParams: this.simParams,
            boids: this.boids,
            doibs: this.doibs,
            predators: this.predators,
        }),)

        this.predators.map((pred) =>
        // boid.update(this.getBoidNeighbours(boid), this.steeringForceCoefficients),
        pred.update(this.predRules, {
            neighbours: this.getBoidNeighbours(pred),
            simParams: this.simParams,
            boids: this.boids,
            doibs: this.doibs,
            predators: this.predators,
        }),)


        if (
            this.simParams.photorealisticRendering &&
            this.water !== undefined &&
            this.water.material instanceof ShaderMaterial
        ) {
            this.water.material.uniforms["time"].value += 1.0 / 60.0;
        }

        super.update();
    }

    updateBoidCount() {
        if (this.simParams.boidCount !== this.boids.length) {
            // Calculate how many boids we need to generate/remove.
            // Do this here so we don't evaluate boids.length on every loop iteration.
            let difference = this.simParams.boidCount - this.boids.length;
            while (difference > 0) {
                // generate new boids
                const boid = Boid.generateWithRandomPosAndVel(this.simParams);
                this.addObjectToScene(boid.mesh);
                this.boids.push(boid);
                difference--;
            }
            while (difference < 0) {
                // remove boids
                const boid = this.boids.pop();
                if (boid === undefined) {
                    // handle the case that for some reason there's no boid to remove
                    break;
                }
                this.removeObjectFromScene(boid.mesh);
                difference++;
            }
        }

        if (this.simParams.doibCount !== this.doibs.length) {
            // Calculate how many boids we need to generate/remove.
            // Do this here so we don't evaluate boids.length on every loop iteration.
            let difference = this.simParams.doibCount - this.doibs.length;
            while (difference > 0) {
                // generate new boids
                const doib = Doib.fromBoid(Boid.generateWithRandomPosAndVel(this.simParams), this.simParams);
                this.addObjectToScene(doib.mesh);
                this.doibs.push(doib);
                difference--;
            }
            while (difference < 0) {
                // remove boids
                const doib = this.doibs.pop();
                if (doib === undefined) {
                    // handle the case that for some reason there's no boid to remove
                    break;
                }
                this.removeObjectFromScene(doib.mesh);
                difference++;
            }
        }

        if (this.simParams.predCount !== this.predators.length) {
            // Calculate how many boids we need to generate/remove.
            // Do this here so we don't evaluate boids.length on every loop iteration.
            let difference = this.simParams.predCount - this.predators.length;
            while (difference > 0) {
                // generate new boids
                const predator = Predator.fromBoid(Boid.generateWithRandomPosAndVel(this.simParams), this.simParams);
                this.addObjectToScene(predator.mesh);
                this.predators.push(predator);
                difference--;
            }
            while (difference < 0) {
                // remove boids
                const predator = this.predators.pop();
                if (predator === undefined) {
                    // handle the case that for some reason there's no boid to remove
                    break;
                }
                this.removeObjectFromScene(predator.mesh);
                difference++;
            }
        }
    }

    getBoidNeighbours(boid: Boid): Boid[] {
        const neighbours = [];
        for (const otherBoid of this.boids.concat(this.doibs)) {
            if (otherBoid === boid) {
                continue;
            }
            if (boid.isOtherBoidVisible(otherBoid, this.simParams.visibilityThreshold)) {
                neighbours.push(otherBoid);
            }
        }
        return neighbours;
    }
}
