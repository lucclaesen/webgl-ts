import IArrayBuffer2d from "./IArrayBuffer2d";

/**
 * A two dimensional arrayBuffer. Used for passing vertex coordinates to the vertex buffer.
 */
export default class ArrayBuffer2d implements IArrayBuffer2d {
    private coordinates: number[];

    /**
     * Creates a two dimensional array buffer for passing positions to the vertex shader.
     * @param gl    The webgl rendering context.
     */
    constructor(private gl: WebGLRenderingContext) {}

    /**
     * Passes the given coordinates (interpreted as pairs of 2d vertex coordinates) to the 
     * array buffer.
     * @param coordinates   The set of coordinates. Every subsequent pair defines a 2d vertex. 
     */
    public push(coordinates: number[]) {
        this.coordinates = coordinates;
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(coordinates), this.gl.STATIC_DRAW);
    }

    /**
     * Draws every triple of vertices as a triangle.
     */
    public drawTriangles() {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.coordinates.length / 2);
    }
}