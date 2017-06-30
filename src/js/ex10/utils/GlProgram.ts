import IProgram from "./IProgram";
import ArrayBuffer from "./ArrayBuffer";
import IArrayBuffer from "./IArrayBuffer";
import IUniform2 from "./IUniform2";
import IUniform4 from "./IUniform4";
import IUniformMatrix3 from "./IUniformMatrix3";
import Matrix3 from "./Matrix3";

export default class GlProgram implements IProgram {
    
    private program: WebGLProgram;
    private arrayBuffer: ArrayBuffer;

    constructor(
        private gl: WebGLRenderingContext, 
        private vertexShader: WebGLShader, 
        private fragmentShader: WebGLShader) {

        this.program = gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
    
        var linked = this.gl.getProgramParameter(this.program, gl.LINK_STATUS);
        if (!linked) {
            var lastError = this.gl.getProgramInfoLog(this.program);
            console.log("Error in program linking:" + lastError);

            this.gl.deleteProgram(this.program);
            throw new Error("Unable to link the program");
        }
    }


    public createArrayBuffer(name: string, dimension: number): IArrayBuffer {
        const buff = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buff);
        const positionAttribute = this.gl.getAttribLocation(this.program, name);

        this.gl.vertexAttribPointer(
            positionAttribute, 
            dimension, 
            this.gl.FLOAT, 
            false, 
            0, 
            0);

        this.gl.enableVertexAttribArray(positionAttribute);
        this.arrayBuffer = new ArrayBuffer(this.gl, dimension);
        return this.arrayBuffer;
    }        
    
    public createUniform2(name: string): IUniform2 {
        const uniformLocation = this.gl.getUniformLocation(this.program, name);
        return {
            set: (x: number, y: number) => {
                this.gl.uniform2f(uniformLocation, x, y);
            }, 
            setv: (v: number[]) => {
                this.gl.uniform2fv(uniformLocation, v);
            }
        };
    }


    public createUniform4(name: string) : IUniform4 {
        const uniformLocation = this.gl.getUniformLocation(this.program, name);
        return {
            set: (x: number, y: number, z: number, w: number) => {
                this.gl.uniform4f(uniformLocation, x, y, z, w);
            }   
        };
    }

    public createUniformMatrix3(name: string) : IUniformMatrix3 {
        const uniformLocation = this.gl.getUniformLocation(this.program, name);
        return {
            set: (m3: Matrix3) => {
                this.gl.uniformMatrix3fv(uniformLocation, false, m3.elements);
            }   
        }; 
    }

    public draw(render: ()=>void): void {
        this.gl.useProgram(this.program);
        resizeCanvas(this.gl, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        render();
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.arrayBuffer.drawTriangles();
    }

}



/**
 * Resizes the canvas of the given context to the given width and
 * height. Besides directly setting width and height properties, it
 * is ensured that gl's viewport is adapted to the new canvas size.
 * @param gl 
 * @param width 
 * @param height 
 */
function resizeCanvas(
  gl: WebGLRenderingContext, 
  width: number, 
  height: number): void {

    const canvas = gl.canvas;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;

      gl.viewport(0, 0, width, height);
    }

}