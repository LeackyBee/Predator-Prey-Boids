export class Bounds3D {
    xMin: number;
    xMax: number;
    xSize: number;
    yMin: number;
    yMax: number;
    ySize: number;
    zMin: number;
    zMax: number;
    zSize: number;

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
        this.xSize = xMax - xMin;
        this.yMin = yMin;
        this.yMax = yMax;
        this.ySize = yMax - yMin;
        this.zMin = zMin;
        this.zMax = zMax;
        this.zSize = zMax - zMin;
    }

    static centredXZ(xWidth: number, zWidth: number, height: number): Bounds3D {
        return new Bounds3D(-xWidth / 2, xWidth / 2, 0, height, -zWidth / 2, zWidth / 2);
    }
}
