import { GlControlsViewModel, GlControlsChangedEvent } from "./GlControlsViewModel";
import ko = require("knockout");
import { 
    loadShader,
    createProgram, 
    getRotationCoordinates, 
    IProgram, 
    IArrayBuffer, 
    IUniform2, 
    IUniform4, M3, M4} from "./utils";

var vshaderSource = require("./glsl/vertex.glsl") as string;
var fshaderSource = require("./glsl/fragment.glsl") as string;

export function run() {

    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl");
    const vShader = loadShader(gl, vshaderSource, gl.VERTEX_SHADER);
    const fShader = loadShader(gl, fshaderSource, gl.FRAGMENT_SHADER);
    const program = createProgram(gl, vShader, fShader);

    const positionArrayBuffer = program.createArrayBuffer("a_position", 3);
    const colorUniform = program.createUniform4("u_color");
    const matrixUniform = program.createUniformMatrix4("u_matrix");

    let translationVector = [0, 0, 0];
    let rotationangle = [0, 0, 0];
    let scaleVector = [1, 1, 1];

    function draw() {
        program.draw(() => {
            
            const up = createBox( {x: 100, y: 500, z: 0}, 100, -400, 100);
            const top = createBox({x: 200, y: 100, z: 0}, 200, 100, 100);
            const middle = createBox({x: 200, y: 300, z: 0}, 150, 100, 100);
            positionArrayBuffer.push(up.concat(top).concat(middle));
            colorUniform.set(0.2, 0.4, 0.4, 1);

            const m = M4.getProjection(canvas.width, canvas.height, 400)
                .multiplyWith(M4.getScale(scaleVector[0], scaleVector[1], scaleVector[2]))
                .multiplyWith(M4.getRotation(rotationangle[0] * Math.PI / 180, rotationangle[1] * Math.PI / 180, rotationangle[2] * Math.PI / 180))
                .multiplyWith(M4.getTranslation(translationVector[0], translationVector[1], translationVector[2]));

            matrixUniform.set(m);
        });
    };

    const glControls = new GlControlsViewModel(3);
    glControls.onChanged((ev: GlControlsChangedEvent) => {
        translationVector = [ev.x, ev.y, ev.z];
        rotationangle = [ev.ax, ev.ay, ev.az];
        scaleVector = [ev.sx, ev.sy, ev.sz];
        draw();
    });


    ko.applyBindings({ glControls: glControls});
    draw();
}

interface IVector3 {
        x: number;
        y: number;
        z: number;
    }

    function createBox(origin: IVector3, width: number, height: number, depth: number): Array<number> {
        const res = [];
        // front rectangle
        res.push(
            origin.x,           origin.y,           origin.z,
            origin.x + width,   origin.y,           origin.z,
            origin.x,           origin.y + height,  origin.z,
            origin.x + width,   origin.y,           origin.z,
            origin.x,           origin.y + height,  origin.z,
            origin.x + width,   origin.y + height,  origin.z
        );
        // back rectangle
        res.push(
            origin.x,           origin.y,           origin.z + depth,
            origin.x + width,   origin.y,           origin.z + depth,
            origin.x,           origin.y + height,  origin.z + depth,
            origin.x + width,   origin.y,           origin.z + depth,
            origin.x,           origin.y + height,  origin.z + depth,
            origin.x + width,   origin.y + height,  origin.z + depth
        );
        // left side
        res.push(
            origin.x,           origin.y,           origin.z,
            origin.x,           origin.y,           origin.z + depth,
            origin.x,           origin.y + height,  origin.z,
            origin.x,           origin.y,           origin.z + depth,
            origin.x,           origin.y + height,  origin.z,
            origin.x,           origin.y + height,  origin.z + depth
        );
        // right side
        res.push(
            origin.x + width,    origin.y,          origin.z,
            origin.x + width,    origin.y,          origin.z + depth,
            origin.x + width,    origin.y + height, origin.z,
            origin.x + width,    origin.y,          origin.z + depth,
            origin.x + width,    origin.y + height, origin.z,
            origin.x + width,    origin.y + height, origin.z + depth
        );
        // top
        res.push(
            origin.x,           origin.y + height,  origin.z,
            origin.x,           origin.y + height,  origin.z + depth,
            origin.x + width,   origin.y + height,  origin.z,
            origin.x,           origin.y + height,  origin.z + depth,
            origin.x + width,   origin.y + height,  origin.z,
            origin.x + width,   origin.y + height,  origin.z + depth
        );
        // bottom
        res.push(
            origin.x,           origin.y,  origin.z,
            origin.x,           origin.y,  origin.z + depth,
            origin.x + width,   origin.y,  origin.z,
            origin.x,           origin.y,  origin.z + depth,
            origin.x + width,   origin.y,  origin.z,
            origin.x + width,   origin.y,  origin.z + depth
        );
        return res;
    }