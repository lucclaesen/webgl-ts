import IArrayBuffer2d from "./IArrayBuffer2d";
import IUniform2 from "./IUniform2";
import IUniform4 from "./IUniform4";
import IUniformMatrix3 from "./IUniformMatrix3";

/**
 * A gl program.
 */
interface IProgram {
    /**
     * Returns an array buffer for passing 2d vertices to the vertex shader. 
     */
    createArrayBuffer2d(name: string): IArrayBuffer2d;
    /**
     * Creates a 2d uniform.
     */
    createUniform2(name: string): IUniform2;
    
    /**
     * Creates a 4d uniform.
     */
    createUniform4(name: string): IUniform4;

    createUniformMatrix3(name: string) : IUniformMatrix3;

    /**
     * Draws the scene given the render function.
     */
    draw(render: ()=>void): void;
}

export default IProgram;