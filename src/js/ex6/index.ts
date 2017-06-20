import * as glUtils from "../gl-utils";
import $ = require("jquery");
import GlControlsViewModel from "./GlControlsViewModel";
import ko = require("knockout");

var vshaderSource = require("./glsl/vertex.glsl") as string;
var fshaderSource = require("./glsl/fragment.glsl") as string;


export function run() {

    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl");
    const vShader = glUtils.loadShader(gl, vshaderSource, gl.VERTEX_SHADER);
    const fShader = glUtils.loadShader(gl, fshaderSource, gl.FRAGMENT_SHADER);
    const program = createProgram(gl, vShader, fShader);

    const positionArrayBuffer = program.createArrayBuffer2d("a_position");
    const colorUniform = program.createUniform4("u_color");
    const translationUniform = program.createUniform2("u_translate");
    const rotationUniform = program.createUniform2("u_rotate");
    const scaleUniform = program.createUniform2("u_scale");
    
    let translationVector = [0, 0];
    let rotationVector = getRotationMatrix(0);
    let scaleVector = [1, 1];

    function draw() {
        program.draw(() => {
            const triangles = [
                0,      0,
                0.5,    0,
                0,     0.5
            ];
            positionArrayBuffer.push(triangles);
            colorUniform.set(0.2, 0.4, 0.4, 1);
            translationUniform.setv(translationVector);
            rotationUniform.setv(rotationVector);
            scaleUniform.setv(scaleVector);
        });
    };

    const glControls = new GlControlsViewModel();
    glControls.onChanged((x, y, angle, sx, sy) => {
        translationVector = [x, y];
        rotationVector = getRotationMatrix(angle);
        scaleVector = [sx, sy];
        draw();
    });

    const viewModel = {
        glControls: glControls
    };

    ko.applyBindings(viewModel);

    // initial draw
    draw();
}

interface IVector2 {
    x: number;
    y: number
}

function getRotationMatrix(angleDegrees: number): number[] {
    const degreeRadians = angleDegrees * Math.PI / 180;
    return [
        Math.cos(degreeRadians),
        Math.sin(degreeRadians)
    ];
}

function createProgram(
    gl: WebGLRenderingContext, 
    vertexShader: WebGLShader, 
    fragmentShader: WebGLShader): IProgram {
    
        return new GlProgram(gl, vertexShader, fragmentShader);
}

interface IProgram {
    createArrayBuffer2d(name: string): IArrayBuffer2d;
    createUniform2(name: string): IUniform2;
    createUniform4(name: string): IUniform4;
    draw(render: ()=>void): void;
}

class GlProgram implements IProgram {
    
    private program: WebGLProgram;
    private arrayBuffer: ArrayBuffer2D;

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

    public createArrayBuffer2d(name: string): IArrayBuffer2d {
        const buff = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buff);
        const positionAttribute = this.gl.getAttribLocation(this.program, name);

        this.gl.vertexAttribPointer(positionAttribute, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.enableVertexAttribArray(positionAttribute);
        this.arrayBuffer = new ArrayBuffer2D(this.gl);
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

    public createUniform4(name: string) {
        const uniformLocation = this.gl.getUniformLocation(this.program, name);
        return {
            set: (x: number, y: number, z: number, w: number) => {
                this.gl.uniform4f(uniformLocation, x, y, z, w);
            }   
        };
    }

    public draw(render: ()=>void): void {
        this.gl.useProgram(this.program);
        glUtils.resizeCanvas(this.gl, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        render();
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.arrayBuffer.drawTriangles();
    }

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
    setv(v: number[]): void;
}

/**
 * A four dimensional uniform.
 */
interface IUniform4 {
    set(x: number, y: number, z: number, w: number): void;
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