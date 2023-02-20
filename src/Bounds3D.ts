export class Bounds3D {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    zMin: number;
    zMax: number;

    constructor(
        xMin: number,
        xMax: number,
        yMin: number,
        yMax: number,
        zMin: number,
        zMax: number,
    ) {
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
        this.zMin = zMin;
        this.zMax = zMax;
    }

    static centredXZ(xWidth: number, zWidth: number, height: number): Bounds3D {
        return new Bounds3D(-xWidth / 2, xWidth / 2, 0, height, -zWidth / 2, zWidth / 2);
    }
}
