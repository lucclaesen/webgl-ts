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