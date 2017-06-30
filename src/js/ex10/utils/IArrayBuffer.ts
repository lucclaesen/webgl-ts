/**
 * An array buffer of vertix coordinates. Calling push populates the buffer with float 
 * coordinates. A subsequent drawTriangles call will signal the vertex shader to render all vertices 
 * as triangles.
 */
interface IArrayBuffer {
    push(coordinates: number[]): void;
    drawTriangles(): void;
}

export default IArrayBuffer;
