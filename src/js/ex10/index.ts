import { GlControlsViewModel, GlControlsChangedEvent } from "./GlControlsViewModel";
import ko = require("knockout");
import { 
    loadShader,
    createProgram, 
    getRotationCoordinates, 
    IProgram, 
    IArrayBuffer, 
    IUniform2, 
    IUniform4, M3} from "./utils";

var vshaderSource = require("./glsl/vertex.glsl") as string;
var fshaderSource = require("./glsl/fragment.glsl") as string;

export function run() {

    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl");
    const vShader = loadShader(gl, vshaderSource, gl.VERTEX_SHADER);
    const fShader = loadShader(gl, fshaderSource, gl.FRAGMENT_SHADER);
    const program = createProgram(gl, vShader, fShader);

    const positionArrayBuffer = program.createArrayBuffer("a_position", 2);
    const colorUniform = program.createUniform4("u_color");
    const matrixUniform = program.createUniformMatrix3("u_matrix");

    let translationVector = [0, 0];
    let rotationangle = 0;
    let scaleVector = [1, 1];

    function draw() {
        program.draw(() => {
            
            // given the coordinate space after quasi-projection:
            // draw with respect to canvas size, with 0 top left, 
            // X+ from 0 to canvas.with horizontal
            // Y+ from 0 to canvas height vertical
            const triangles = [
                375,            300,                    // center canvas
                375+0.5*375,    300,                    // down left
                375,            300-0.5*300             // upper right
            ];

            positionArrayBuffer.push(triangles);
            colorUniform.set(0.2, 0.4, 0.4, 1);

            const m = M3.getQuasiProjection(canvas.width, canvas.height)
                .multiplyWith(M3.getScale(scaleVector[0], scaleVector[1]))
                .multiplyWith(M3.getRotation(rotationangle * Math.PI / 180))
                .multiplyWith(M3.getTranslation(translationVector[0], translationVector[1]));

            matrixUniform.set(m);
        });
    };

    const glControls = new GlControlsViewModel();
    glControls.onChanged((ev: GlControlsChangedEvent) => {
        translationVector = [ev.x, ev.y];
        rotationangle = ev.az;
        scaleVector = [ev.sx, ev.sy];
        draw();
    });


    ko.applyBindings({ glControls: glControls});
    draw();
}