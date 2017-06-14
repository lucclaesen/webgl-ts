import * as glUtils from "../gl-utils";
var vshaderSource = require("./glsl/vertex.glsl") as string;
var fshaderSource = require("./glsl/fragment.glsl") as string;

export function run() {

    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl");
    const vShader = glUtils.loadShader(gl, vshaderSource, gl.VERTEX_SHADER);
    const fShader = glUtils.loadShader(gl, fshaderSource, gl.FRAGMENT_SHADER);
    const program = glUtils.createProgram(gl, [vShader, fShader]);

    const positionArrayBuffer = createArrayBuffer2d(gl, program, "a_position");
    const resolutionUniform = createUniform2(gl, program, "u_resolution");
    const colorUniform = createUniform4(gl, program, "u_color");

    // draw

    gl.useProgram(program);
    const triangles = [
        300,    300,
        300,    600,
        600,    300,
        150,    150,
        150,    300,
        300,    150
    ];
    positionArrayBuffer.push(triangles);
    resolutionUniform.set(canvas.width, canvas.height);
    colorUniform.set(0.2, 0.4, 0.4, 1);

    glUtils.resizeCanvas(gl, canvas.clientWidth, canvas.clientHeight);
    positionArrayBuffer.drawTriangles();
}

/**
 * An array buffer of 2D vertices. Calling push populates the buffer with float coordinates. A 
 * subsequent drawTriangles call will signal the vertex shader to render all vertices as
 * triangles.
 */
interface IArrayBuffer2d {
    push(coordinates: number[]): void;
    drawTriangles(): void;
}

/**
 * A two dimensional Uniform.
 */
interface IUniform2 {
    set(x: number, y: number): void;
}

/**
 * A four dimensional uniform.
 */
interface IUniform4 {
    set(x: number, y: number, z: number, w: number): void;
}

/**
 * A factory function that returns a uniform that can be filled with x and y values.
 * @param gl 
 * @param program 
 * @param nameInShader 
 */
function createUniform2(
    gl: WebGLRenderingContext, 
    program: WebGLProgram, 
    nameInShader: string) : IUniform2 {
    const uniformLocation = gl.getUniformLocation(program, nameInShader);
    return {
        set: function(x: number, y: number) {
            gl.uniform2f(uniformLocation, x, y);
        }
    }
}

function createUniform4(
    gl: WebGLRenderingContext, 
    program: WebGLProgram, 
    nameInShader: string): IUniform4 {
    const uniformLocation = gl.getUniformLocation(program, nameInShader);
    return {
        set: function(x: number, y: number, z: number, w: number) {
            gl.uniform4f(uniformLocation, x, y, z, w);
        }
    }
}

/**
 * Creates an array buffer for passing 2D float vertices to the vertex shader.
 * @param gl 
 * @param program 
 * @param nameInShader 
 */
function createArrayBuffer2d(
    gl: WebGLRenderingContext, 
    program: WebGLProgram, 
    nameInShader: string): IArrayBuffer2d {

    const buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    const positionAttribute = gl.getAttribLocation(program, nameInShader);

    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(positionAttribute);
    return new ArrayBuffer2D(gl);
}


class ArrayBuffer2D implements IArrayBuffer2d {
    private coordinates: number[];

    constructor(private gl: WebGLRenderingContext) {}

    public push(coordinates: number[]) {
        this.coordinates = coordinates;
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(coordinates), this.gl.STATIC_DRAW);
    }

    public drawTriangles() {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.coordinates.length / 2);
    }

}