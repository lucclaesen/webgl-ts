import GlControlsViewModel from "./GlControlsViewModel";
import ko = require("knockout");
import { 
    loadShader,
    createProgram, 
    getRotationCoordinates, 
    IProgram, 
    IArrayBuffer2d, 
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

    const positionArrayBuffer = program.createArrayBuffer2d("a_position");
    const colorUniform = program.createUniform4("u_color");
    const matrixUniform = program.createUniformMatrix3("u_matrix");

    let translationVector = [0, 0];
    let rotationangle = 0;
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

            var translation = M3.getTranslation(translationVector[0], translationVector[1]);
            var rotation = M3.getRotation(rotationangle * Math.PI / 180);
            var scale = M3.getScale(scaleVector[0], scaleVector[1]);
            matrixUniform.set(translation.multiplyWith(rotation.multiplyWith(scale)));
        });
    };

    const glControls = new GlControlsViewModel();
    glControls.onChanged((x, y, angle, sx, sy) => {
        translationVector = [x, y];
        rotationangle = angle;
        scaleVector = [sx, sy];
        draw();
    });


    ko.applyBindings({ glControls: glControls});
    draw();
}