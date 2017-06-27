/**
 * An array buffer of 2D vertices. Calling push populates the buffer with float coordinates. A 
 * subsequent drawTriangles call will signal the vertex shader to render all vertices as
 * triangles.
 */
interface IArrayBuffer2d {
    push(coordinates: number[]): void;
    drawTriangles(): void;
}

export default IArrayBuffer2d;
