export default class M4 {

    constructor(private els: number[] = identity) {
        if (els.length != 16)
            throw Error("A 4 dimensional array needs 16 elements.");
    }

    public getElement(i: number, j: number) {
        return getElement4(this.els, i, j);
    }

    public multiplyWith(other: M4){
        return new M4(multiply(this.els, other.els));
    }

    public get elements() {
        return this.els;
    }

    public static getIdentity(): M4 {
        return new M4(identity);
    }

    public static getTranslation(tx: number, ty: number, tz: number): M4 {
        return new M4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1 
        ]);
    }

    public static getRotation(ax: number, ay: number, az: number): M4 {
        // like three.js, z-rotation is applied first, then y and finally z ...
        return new M4(rotationZ(az))
            .multiplyWith(new M4(rotationY(ay)))
            .multiplyWith(new M4(rotationX(ax)));
    }

    public static getScale(sx: number, sy: number, sz: number): M4 {
        return new M4([
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ]);
    }

    public static getProjection(width: number, height: number, depth: number): M4 {
        return new M4([
            2 / width,      0,              0,          0,
            0,              -2 / height,    0,          0,
            0,              0,              2 / depth,  0,
            -1,             1,              0,          1
        ]);
    }
}

const identity = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
];

function rotationX(ax: number): Array<number> {
    var c = Math.cos(ax);
    var s = Math.sin(ax);
    return [
        1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1
    ];
}


function rotationY(ay: number): Array<number> {
    var c = Math.cos(ay);
    var s = Math.sin(ay);
    return [
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1
    ];
}

function rotationZ(az: number): Array<number> {
    var c = Math.cos(az);
    var s = Math.sin(az);
    return [
        c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
}

function getElement4(arr: Array<number>, i: number, j: number): number {
    return arr[4 * i + j];
} 

function multiply(a: Array<number>, b: Array<number>): Array<number> {
    return [
        getElement4(a, 0, 0) * getElement4(b, 0, 0) + 
        getElement4(a, 0, 1) * getElement4(b, 1, 0) + 
        getElement4(a, 0, 2) * getElement4(b, 2, 0) +
        getElement4(a, 0, 3) * getElement4(b, 3, 0),
        
        getElement4(a, 0, 0) * getElement4(b, 0, 1) + 
        getElement4(a, 0, 1) * getElement4(b, 1, 1) + 
        getElement4(a, 0, 2) * getElement4(b, 2, 1) +
        getElement4(a, 0, 3) * getElement4(b, 3, 1),

        getElement4(a, 0, 0) * getElement4(b, 0, 2) + 
        getElement4(a, 0, 1) * getElement4(b, 1, 2) + 
        getElement4(a, 0, 2) * getElement4(b, 2, 2) +
        getElement4(a, 0, 3) * getElement4(b, 3, 2),

        getElement4(a, 0, 0) * getElement4(b, 0, 3) + 
        getElement4(a, 0, 1) * getElement4(b, 1, 3) + 
        getElement4(a, 0, 2) * getElement4(b, 2, 3) +
        getElement4(a, 0, 3) * getElement4(b, 3, 3),

        // end row0, begin row 1

        getElement4(a, 1, 0) * getElement4(b, 0, 0) + 
        getElement4(a, 1, 1) * getElement4(b, 1, 0) + 
        getElement4(a, 1, 2) * getElement4(b, 2, 0) +
        getElement4(a, 1, 3) * getElement4(b, 3, 0),

        getElement4(a, 1, 0) * getElement4(b, 0, 1) + 
        getElement4(a, 1, 1) * getElement4(b, 1, 1) + 
        getElement4(a, 1, 2) * getElement4(b, 2, 1) +
        getElement4(a, 1, 3) * getElement4(b, 3, 1),

        getElement4(a, 1, 0) * getElement4(b, 0, 2) + 
        getElement4(a, 1, 1) * getElement4(b, 1, 2) + 
        getElement4(a, 1, 2) * getElement4(b, 2, 2) +
        getElement4(a, 1, 3) * getElement4(b, 3, 2),

        getElement4(a, 1, 0) * getElement4(b, 0, 3) + 
        getElement4(a, 1, 1) * getElement4(b, 1, 3) + 
        getElement4(a, 1, 2) * getElement4(b, 2, 3) +
        getElement4(a, 1, 3) * getElement4(b, 3, 3),

        //end row 1, begin row2

        getElement4(a, 2, 0) * getElement4(b, 0, 0) + 
        getElement4(a, 2, 1) * getElement4(b, 1, 0) + 
        getElement4(a, 2, 2) * getElement4(b, 2, 0) +
        getElement4(a, 2, 3) * getElement4(b, 3, 0),

        getElement4(a, 2, 0) * getElement4(b, 0, 1) + 
        getElement4(a, 2, 1) * getElement4(b, 1, 1) + 
        getElement4(a, 2, 2) * getElement4(b, 2, 1) +
        getElement4(a, 2, 3) * getElement4(b, 3, 1),

        getElement4(a, 2, 0) * getElement4(b, 0, 2) + 
        getElement4(a, 2, 1) * getElement4(b, 1, 2) + 
        getElement4(a, 2, 2) * getElement4(b, 2, 2) +
        getElement4(a, 2, 3) * getElement4(b, 3, 2),

        getElement4(a, 2, 0) * getElement4(b, 0, 3) + 
        getElement4(a, 2, 1) * getElement4(b, 1, 3) + 
        getElement4(a, 2, 2) * getElement4(b, 2, 3) +
        getElement4(a, 2, 3) * getElement4(b, 3, 3), 

        // begin row 3

        getElement4(a, 3, 0) * getElement4(b, 0, 0) + 
        getElement4(a, 3, 1) * getElement4(b, 1, 0) + 
        getElement4(a, 3, 2) * getElement4(b, 2, 0) +
        getElement4(a, 3, 3) * getElement4(b, 3, 0),

        getElement4(a, 3, 0) * getElement4(b, 0, 1) + 
        getElement4(a, 3, 1) * getElement4(b, 1, 1) + 
        getElement4(a, 3, 2) * getElement4(b, 2, 1) +
        getElement4(a, 3, 3) * getElement4(b, 3, 1),

        getElement4(a, 3, 0) * getElement4(b, 0, 2) + 
        getElement4(a, 3, 1) * getElement4(b, 1, 2) + 
        getElement4(a, 3, 2) * getElement4(b, 2, 2) +
        getElement4(a, 3, 3) * getElement4(b, 3, 2),

        getElement4(a, 3, 0) * getElement4(b, 0, 3) + 
        getElement4(a, 3, 1) * getElement4(b, 1, 3) + 
        getElement4(a, 3, 2) * getElement4(b, 2, 3) +
        getElement4(a, 3, 3) * getElement4(b, 3, 3)
    ];
}
