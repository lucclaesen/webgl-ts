import GlControlsViewModel from "./GlControlsViewModel";
import ko = require("knockout");
import { 
    loadShader,
    createProgram, 
    getRotationCoordinates, 
    IProgram, 
    IArrayBuffer2d, 
    IUniform2, 
    IUniform4} from "./utils";

var vshaderSource = require("./glsl/vertex.glsl") as string;
var fshaderSource = require("./glsl/fragment.glsl") as string;

export function run() {

    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const gl = canvas.getContext("webgl");
    const vShader = loadShader(gl, vshaderSource, gl.VERTEX_SHADER);
    const fShader = loadShader(gl, fshaderSource, gl.FRAGMENT_SHADER);
    const program = createProgram(gl, vShader, fShader);

    const positionArrayBuffer = program.createArrayBuffer2d("a_position");
    const colorUniform = program.createUniform4("u_color");
    const translationUniform = program.createUniform2("u_translate");
    const rotationUniform = program.createUniform2("u_rotate");
    const scaleUniform = program.createUniform2("u_scale");
    
    let translationVector = [0, 0];
    let rotationVector = getRotationCoordinates(0);
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
        rotationVector = getRotationCoordinates(angle);
        scaleVector = [sx, sy];
        draw();
    });


    ko.applyBindings({ glControls: glControls});
    draw();
}