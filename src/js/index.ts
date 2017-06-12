import GlUtils from "./gl/GlUtils"
import $ = require("jquery")

$(() => {
    var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    var gl = canvas.getContext("webgl") as WebGLRenderingContext;
    var utils = new GlUtils(gl);
    var vShader = utils.createVertexShader("vshader");
    var fShader = utils.createFragmentShader("fshader");
    var program =  utils.createProgram(vShader, fShader);

    var somePoints = [0, 0, 0, 0.5, 0.7, 0];
    utils.setInputVertices(program, somePoints);


    console.log("done");
});