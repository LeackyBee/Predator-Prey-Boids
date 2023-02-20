import { Rule, RuleArguments } from "./Rule";
import { Boid } from "../objects/Boid";
import * as THREE from "three";

/**
 * Rule to contain the boids inside the world area, so they
 * don't go flying off into oblivion
 */
export class WorldBoundaryRule extends Rule {
    calculateVector(thisBoid: Boid, args: RuleArguments): THREE.Vector3 {
        const avoidNegXBound = this.avoidBoundaryVector(
            thisBoid.position.x,
            args.simParams.worldDimens.xMin,
            new THREE.Vector3(1, 0, 0),
            true,
        );
        const avoidPosXBound = this.avoidBoundaryVector(
            thisBoid.position.x,
            args.simParams.worldDimens.xMax,
            new THREE.Vector3(-1, 0, 0),
            false,
        );

        const avoidNegYBound = this.avoidBoundaryVector(
            thisBoid.position.y,
            args.simParams.worldDimens.yMin,
            new THREE.Vector3(0, 1, 0),
            true,
        );
        const avoidPosYBound = this.avoidBoundaryVector(
            thisBoid.position.y,
            args.simParams.worldDimens.yMax,
            new THREE.Vector3(0, -1, 0),
            false,
        );

        const avoidNegZBound = this.avoidBoundaryVector(
            thisBoid.position.z,
            args.simParams.worldDimens.zMin,
            new THREE.Vector3(0, 0, 1),
            true,
        );
        const avoidPosZBound = this.avoidBoundaryVector(
            thisBoid.position.z,
            args.simParams.worldDimens.zMax,
            new THREE.Vector3(0, 0, -1),
            false,
        );

        const avoidBoundariesVector = new THREE.Vector3();
        avoidBoundariesVector.add(avoidNegXBound);
        avoidBoundariesVector.add(avoidPosXBound);
        avoidBoundariesVector.add(avoidNegYBound);
        avoidBoundariesVector.add(avoidPosYBound);
        avoidBoundariesVector.add(avoidNegZBound);
        avoidBoundariesVector.add(avoidPosZBound);

        avoidBoundariesVector.multiplyScalar(this.weight);

        return avoidBoundariesVector;
    }

    private avoidBoundaryVector(
        position: number,
        boundary: number,
        avoidanceVector: THREE.Vector3,
        isLowBoundary: boolean,
    ): THREE.Vector3 {
        const distToWall = isLowBoundary ? position - boundary : boundary - position;
        const avoidanceMagnitude = Math.exp(-distToWall);
        avoidanceVector.setLength(avoidanceMagnitude);
        return avoidanceVector;
    }
}
