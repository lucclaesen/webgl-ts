/**
 * A port of https://webglfundamentals.org/webgl/resources/webgl-utils.js
 */


function error(msg: string) {
    console.log(msg);
}


/**
 * Loads a shader.
 * @param gl                    The WebGLRenderingContext to use.
 * @param shaderSource          The shader source.
 * @param shaderType            The type of shader.
 * @param opt_errorCallback     callback for errors.
 * @return                      The created shader.
 */
export function loadShader(
      gl: WebGLRenderingContext, 
      shaderSource: string, 
      shaderType: number, 
      errorCallback?: (string) => void) {
    
    var errFn = errorCallback || error;
    
    // Create the shader object
    var shader = gl.createShader(shaderType);

    // Load the shader source
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check the compile status
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      // Something went wrong during compilation; get the error
      var lastError = gl.getShaderInfoLog(shader);
      errFn("*** Error compiling shader '" + shader + "':" + lastError);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
}


/**
 * Creates a program, attaches shaders and links the
 * program.
 * @param shaders The shaders to attach
 * @param errorCallback callback for errors. By default it just prints an error to the console
 *        on error. If you want something else pass an callback. It's passed an error message.
 */
export function createProgram(
      gl: WebGLRenderingContext, 
      shaders: WebGLShader[], 
      errorCallback?: (string) => void): WebGLProgram {
    
    var errFn = errorCallback || error;
    var program = gl.createProgram();
    shaders.forEach(function(shader) {
      gl.attachShader(program, shader);
    });
  
    gl.linkProgram(program);

    // Check the link status
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        // something went wrong with the link
        var lastError = gl.getProgramInfoLog(program);
        errFn("Error in program linking:" + lastError);

        gl.deleteProgram(program);
        return null;
    }
    return program;
}


/**
 * Resizes the canvas of the given context to the given width and
 * height. Besides directly setting width and height properties, it
 * is ensured that gl's viewport is adapted to the new canvas size.
 * @param gl 
 * @param width 
 * @param height 
 */
export function resizeCanvas(
  gl: WebGLRenderingContext, 
  width: number, 
  height: number): void {

    const canvas = gl.canvas;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;

      gl.viewport(0, 0, width, height);
    }

}