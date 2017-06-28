export default class M3 {

    constructor(private els: number[] = identity) {
        if (els.length != 9)
            throw Error("A 3 dimensional array needs 9 elements.");
    }

    public getElement(i: number, j: number) {
        return getElement3(this.els, i, j);
    }

    public multiplyWith(other: M3){
        return new M3(multiply(this.els, other.els));
    }

    public get elements() {
        return this.els;
    }

    public static getIdentity(): M3 {
        return new M3(identity);
    }

    public static getTranslation(tx: number, ty: number): M3 {
        return new M3([
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1
        ]);
    }

    public static getRotation(thetaRad: number): M3 {
        var c = Math.cos(thetaRad);
        var s = Math.sin(thetaRad);
        return new M3([
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ]);
    }

    public static getScale(sx: number, sy: number): M3 {
        return new M3([
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ]);
    }
}

const identity = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
];

function getElement3(arr: Array<number>, i: number, j: number): number {
    return arr[3 * i + j];
} 

function multiply(a: Array<number>, b: Array<number>): Array<number> {
    return [
        getElement3(b, 0, 0) * getElement3(a, 0, 0) + 
        getElement3(b, 0, 1) * getElement3(a, 1, 0) + 
        getElement3(b, 0, 2) * getElement3(a, 2, 0),

        getElement3(b, 0, 0) * getElement3(a, 0, 1) + 
        getElement3(b, 0, 1) * getElement3(a, 1, 1) + 
        getElement3(b, 0, 2) * getElement3(a, 2, 1),

        getElement3(b, 0, 0) * getElement3(a, 0, 2) + 
        getElement3(b, 0, 1) * getElement3(a, 1, 2) + 
        getElement3(b, 0, 2) * getElement3(a, 2, 2),

        getElement3(b, 1, 0) * getElement3(a, 0, 0) + 
        getElement3(b, 1, 1) * getElement3(a, 1, 0) + 
        getElement3(b, 1, 2) * getElement3(a, 2, 0),

        getElement3(b, 1, 0) * getElement3(a, 0, 1) + 
        getElement3(b, 1, 1) * getElement3(a, 1, 1) + 
        getElement3(b, 1, 2) * getElement3(a, 2, 1),

        getElement3(b, 1, 0) * getElement3(a, 0, 2) + 
        getElement3(b, 1, 1) * getElement3(a, 1, 2) + 
        getElement3(b, 1, 2) * getElement3(a, 2, 2),

        getElement3(b, 2, 0) * getElement3(a, 0, 0) + 
        getElement3(b, 2, 1) * getElement3(a, 1, 0) + 
        getElement3(b, 2, 2) * getElement3(a, 2, 0),

        getElement3(b, 2, 0) * getElement3(a, 0, 1) + 
        getElement3(b, 2, 1) * getElement3(a, 1, 1) + 
        getElement3(b, 2, 2) * getElement3(a, 2, 1),

        getElement3(b, 2, 0) * getElement3(a, 0, 2) + 
        getElement3(b, 2, 1) * getElement3(a, 1, 2) + 
        getElement3(b, 2, 2) * getElement3(a, 2, 2)
    ];
}

export { identity, multiply };