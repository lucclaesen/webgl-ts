import IProgram from "./IProgram";
import GlProgram from "./GlProgram";
import IArrayBuffer2d from "./IArrayBuffer2d";
import IUniform2 from "./IUniform2";
import IUniform4 from "./IUniform4";
import M3  from "./Matrix3";

function createProgram(
    gl: WebGLRenderingContext, 
    vertexShader: WebGLShader, 
    fragmentShader: WebGLShader): IProgram {
        return new GlProgram(gl, vertexShader, fragmentShader);
}

function getRotationCoordinates(angleDegrees: number): number[] {
    const degreeRadians = angleDegrees * Math.PI / 180;
    return [
        Math.cos(degreeRadians),
        Math.sin(degreeRadians)
    ];
}



/**
 * Loads a shader.
 * @param gl                    The WebGLRenderingContext to use.
 * @param shaderSource          The shader source.
 * @param shaderType            The type of shader.
 * @param opt_errorCallback     callback for errors.
 * @return                      The created shader.
 */
function loadShader(
      gl: WebGLRenderingContext, 
      shaderSource: string, 
      shaderType: number) {
    
    
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
      console.log("Error compiling shader '" + shader + "':" + lastError);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
}


export {
    loadShader,
    createProgram,
    getRotationCoordinates,
    IProgram,
    IArrayBuffer2d,
    IUniform2,
    IUniform4,
    M3
};
