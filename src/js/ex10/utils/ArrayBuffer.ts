import IArrayBuffer from "./IArrayBuffer";

/**
 * Used for passing vertex coordinates to the vertex buffer.
 */
export default class ArrayBuffer implements IArrayBuffer {
    private coordinates: number[];

    /**
     * Creates an array buffer of the given dimension for passing positions to the vertex shader.
     * @param gl    The webgl rendering context.
     * @param dim   The dimension of the buffer (2, 3, ... D).
     */
    constructor(private gl: WebGLRenderingContext, private dim: number) {}

    /**
     * Passes the given coordinates (interpreted as dim-tuples of vertex coordinates) to the 
     * array buffer.
     * @param coordinates   The set of coordinates. Every subsequent dim-tuple defines a dim-d 
     *                      vertex. 
     */
    public push(coordinates: number[]) {
        this.coordinates = coordinates;
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER, 
            new Float32Array(coordinates), 
            this.gl.STATIC_DRAW);
    }

    /**
     * Draws every triple of vertices as a triangle.
     */
    public drawTriangles() {
        this.gl.drawArrays(
            this.gl.TRIANGLES, 
            0, 
            this.coordinates.length / this.dim
            );
    }
}