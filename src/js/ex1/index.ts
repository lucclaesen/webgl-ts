import GlUtils from "./glUtils";
var vshaderSource = require("./glsl/vertex.glsl") as string;
var fshaderSource = require("./glsl/fragment.glsl") as string;


/**
 * A first, simple program to explore the webgl interface.
 */
export function simpleStaticTriangle() {

    var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    var gl = canvas.getContext("webgl") as WebGLRenderingContext;
    var utils = new GlUtils(gl);
    var vShader = utils.createVertexShaderFromSource(vshaderSource);
    var fShader = utils.createFragmentShaderFromSource(fshaderSource);
    var program =  utils.createProgram(vShader, fShader);

    // Since our vertex shader simply copies the inputted values, we need to provide clip space
    // coordinates directly. Usually, it is the vertex shader's job to output clip space positions. 
    var somePoints = [
        0,      0,          // triangle 1 
        0,      0.5, 
        0.7,    0,
        0.7,    0,          // triangle2
        0.7,    0.5,
        0,      0.5
    ];

    const vertexSize = 2;
    utils.setInputVertices(program, somePoints, vertexSize);

    reSize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    utils.clearCanvas();


    // The actual draw instruction sets up gl to draw triangles. This tells gl to take 3 consecutive 
    // vertices and draw a primitive. Furhtermore, in order to process all vertices, the number
    // of all vertices in the buffer needs to be passed.
    gl.useProgram(program);
    const vertexCount = somePoints.length / vertexSize;
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

}

/**
 * In order to avoid that the actual framebuffer dimensions (the number of pixels in the
 * canvas) and the canvas's "display size" drift, make sure that the framebuffer adapts
 * to the client size of the canvas (usually determined by css and device display properties).
 *
 * Canvas.width and height are attributes only of canvas, svg, ... and determine the size of the
 * drawing buffer that is used in rendering the images
 * Html.Element.clientWidth and clientHeight are attributes common to all html elements and reflect
 * the dimensions (in px) of an element on the screen.
 * 
 * Drift between the two is analogous to zooming in on a raster image.  
 * @param canvas 
 */
function reSize(canvas: HTMLCanvasElement) {
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
}