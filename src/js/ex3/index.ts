import GlUtils from "./glUtils";
var vshaderSource = require("./glsl/vertex.glsl") as string;
var fshaderSource = require("./glsl/fragment.glsl") as string;


/**
 * Render multiple triangles
 */
export function run() {

    var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    var gl = canvas.getContext("webgl") as WebGLRenderingContext;
    var utils = new GlUtils(gl);
    var vShader = utils.createVertexShaderFromSource(vshaderSource);
    var fShader = utils.createFragmentShaderFromSource(fshaderSource);
    var program =  utils.createProgram(vShader, fShader);


    /**
     * Locations. We have
     * - an attribute for the positions
     * - a uniform for the resolution
     * - a uniform for the color
     */
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const colorUniformLocation = gl.getUniformLocation(program, "u_color");

    /**
     * Set up the buffer out of which the positionAttribute will be filled
     */    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    reSize(canvas);
    
    // viewport information guides gl in how to convert from clip space to pixels
    gl.viewport(0, 0, canvas.width, canvas.height);

    // clear
    utils.clearCanvas();

    gl.useProgram(program);

    // turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // pass the resolution to u_resolution
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    /**
     * Set the semantics of the buffer: it will contain vec<float, float> information
     */
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const vertexDim = 2;       
    const coordType = gl.FLOAT;
    gl.vertexAttribPointer(positionAttributeLocation, vertexDim, coordType, false, 0, 0);

    /**
     * Feed the buffer
     */
    drawRandomTriangles(gl, colorUniformLocation, 10);
}

/**
 * Adds 3 vertices to the buffer
 * @param context 
 * @param x 
 * @param y 
 * @param width 
 * @param height 
 */
function addTriangleVerticesToBuffer(
    context: WebGLRenderingContext, 
    x: number, 
    y: number, 
    width: number,
    height: number): void {

    /**
     * 
     */
    const x1 = x, y1 = y;
    const x2 = x + width, y2 = y1;
    const x3 = x, y3 = y + height;

    const coordinates = new Float32Array([
        x1, y1,
        x2, y2,
        x3, y3
    ]);

    context.bufferData(context.ARRAY_BUFFER, coordinates, context.STATIC_DRAW);
}

function randomInt(range: number): number {
    return Math.floor(Math.random() * range);
}

function drawRandomTriangles(
    gl: WebGLRenderingContext, 
    colorUniformLocation: WebGLUniformLocation, 
    count: number) {
    
    for(var i = 0; i < count; i++) {
        addTriangleVerticesToBuffer(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));
        gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
        // draw a single triangle
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
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