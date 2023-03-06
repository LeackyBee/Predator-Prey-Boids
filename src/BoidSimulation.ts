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
import { PredatorAvoidanceRule } from "./rules/PredatorAvoidanceFile";
import { Arena } from "./objects/Arena";
import { Doib } from "./objects/Doib";
import { Predator } from "./objects/Predator";

export interface BoidSimulationParams {
    boidCount: number;
    doibCount: number;
    predCount: number;
    worldDimens: Bounds3D;
    randomnessPerTimestep: number;
    randomnessLimit: number;
}

export class BoidSimulation extends Simulation {
    controlsGui: GUI;

    boids: Boid[] = [];
    doibs: Doib[] = [];
    predators: Predator[] = [];

    simParams: BoidSimulationParams = {
        boidCount: 50,
        doibCount: 50,
        predCount: 2,
        worldDimens: Bounds3D.centredXZ(200, 200, 100),
        randomnessPerTimestep: 0.01,
        randomnessLimit: 0.1,
    };

    rules = [
        new SeparationRule(0.8),
        new CohesionRule(1),
        new AlignmentRule(1),
        new WorldBoundaryRule(10),
        new CollisionAvoidanceRule(10),
        new PredatorAvoidanceRule(10),
    ];

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
        const ruleWeightsGui = this.controlsGui.addFolder("Rule weights");
        ruleWeightsGui.open();
        for (const rule of this.rules) {
            ruleWeightsGui.add(rule, "weight", rule.minWeight, rule.maxWeight, 0.1).name(rule.name);
        }

        // add a floor to the simulation
        const floor = new Floor();
        this.addObjectToScene(floor.mesh);

        const arena = new Arena(this.simParams.worldDimens);
        this.addObjectsToScene(arena.mesh);
    }

    update() {
        // update boids before updating base simulation to rerender
        this.updateBoidCount();

        this.boids.map((boid) =>
            // boid.update(this.getBoidNeighbours(boid), this.steeringForceCoefficients),
            boid.update(this.rules, {
                neighbours: this.getBoidNeighbours(boid),
                simParams: this.simParams,
                predators: this.getBoidPredators(boid),
            }),
        );

        this.doibs.map((doib) =>
        // boid.update(this.getBoidNeighbours(boid), this.steeringForceCoefficients),
        doib.update(this.rules, {
            neighbours: this.getBoidNeighbours(doib),
            simParams: this.simParams,
            predators: this.getBoidPredators(doib),
        }),)

        super.update();
    }

    updateBoidCount() {
        if (this.simParams.boidCount !== this.boids.length) {
            // Calculate how many boids we need to generate/remove.
            // Do this here so we don't evaluate boids.length on every loop iteration.
            let difference = this.simParams.boidCount - this.boids.length;
            while (difference > 0) {
                // generate new boids
                const boid = Boid.generateWithRandomPosAndVel();
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
                const doib = Doib.fromBoid(Boid.generateWithRandomPosAndVel());
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
                const predator = Predator.fromBoid(Boid.generateWithRandomPosAndVel());
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
            if (boid.isOtherBoidVisible(otherBoid, boid.visibilityRange)) {
                neighbours.push(otherBoid);
            }
        }
        return neighbours;
    }

    getBoidPredators(boid: Boid): Boid[] {
        const predators = [];
        for (const predator of this.predators) {
            if (boid.isOtherBoidVisible(predator, boid.predatorRange)) {
                predators.push(predator);
            }
        }
        return predators;
    }
}
