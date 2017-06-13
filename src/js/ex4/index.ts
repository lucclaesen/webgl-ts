import * as glUtils from "../gl-utils";
var vshaderSource = require("./glsl/vertex.glsl") as string;
var fshaderSource = require("./glsl/fragment.glsl") as string;


const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl");
var vShader = glUtils.loadShader(gl, vshaderSource, gl.VERTEX_SHADER);
var fShader = glUtils.loadShader(gl, fshaderSource, gl.FRAGMENT_SHADER);
const program = glUtils.createProgram(gl, [vShader, fShader]);
