
export default class GlUtils {

    constructor(private context: WebGLRenderingContext) {
    }

    public createVertexShader(scriptId: string): WebGLShader {
        return this.createShader(scriptId, this.context.VERTEX_SHADER);
    }

    public createFragmentShader(scriptId: string): WebGLShader {
        return this.createShader(scriptId, this.context.FRAGMENT_SHADER);
    }

    private createShader(shaderScriptId: string, shaderType: number): WebGLShader {
        var script = document.getElementById(shaderScriptId) as HTMLScriptElement;
        if (!script) {
            throw new Error(`Could not load shader sources from a non existent script ${shaderScriptId}.`);
        }
        return this.createShaderFromScript(script, shaderType);
    }


    private createShaderFromScript(
        shaderScript: HTMLScriptElement, 
        shaderType: number): WebGLProgram {    
        if (shaderType !== this.context.VERTEX_SHADER &&
            shaderType !== this.context.FRAGMENT_SHADER) {
            throw new Error(`${shaderType} is not a valid shader type.`);
        }

        var shader = this.context.createShader(shaderType);
        this.context.shaderSource(shader, shaderScript.text);
        this.context.compileShader(shader);

        // status check
        var compiled = this.context.getShaderParameter(shader, this.context.COMPILE_STATUS);
        if (!compiled && !this.context.isContextLost()) {
            var errorMsg = this.context.getShaderInfoLog(shader);

            // delete the shader in case of failed compilation
            this.context.deleteShader(shader);

             throw new Error(`Shader failed to comile with message ${errorMsg}.`);
        }
        return shader;
    }

    public createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
        var program = this.context.createProgram();
        this.context.attachShader(program, vertexShader);
        this.context.attachShader(program, fragmentShader);

        this.context.linkProgram(program);

        var programStatus = this.context.getProgramParameter(program, this.context.LINK_STATUS);
        if (!programStatus) {
            this.context.deleteShader(vertexShader);
            this.context.deleteShader(fragmentShader);
            this.context.deleteProgram(program);
            throw new Error("Error during linking the program.");
        }
        return program;
    }

    public setInputVertices(program: WebGLProgram, vertices: number[]): void {
        
        // sets up the buffer with data provides by the caller
        var positionBuffer = this.setupBuffer(program, vertices);

        // instructs gl how to use the buffer
        this.context.useProgram(program);
        var positionAttributeLocation = this.context.getAttribLocation(program, "a_position");
        this.context.enableVertexAttribArray(positionAttributeLocation);

        // normally, the position buffer ARRAY_BUFFER bind point is still on 
        this.context.bindBuffer(this.context.ARRAY_BUFFER, positionBuffer);
        var size = 2;   // 2 coordinates for one vertex / iteration
        var type = this.context.FLOAT;  // coordinate number type
        var normalize = false;
        var stride = 0; // with stride 0, the vertex shader will move formard size * (sizeof(type))
        var offset = 0; 
        this.context.vertexAttribPointer(
            positionAttributeLocation,
            size,
            type,
            normalize,
            stride,
            offset);
    }

    private setupBuffer(program: WebGLProgram, vertices: number[]): WebGLBuffer {
        var positionBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, positionBuffer);

        var vertexFloatArray = new Float32Array(vertices);

        // this fills up {@link positionBuffer} because the latter is currently 'bound' to the 
        // inner global "ARRAY_BUFFER"
        this.context.bufferData(
            this.context.ARRAY_BUFFER, 
            vertexFloatArray, 
            this.context.STATIC_DRAW);

            return positionBuffer;
    }





    public clearCanvas() {
        this.context.clearColor(0, 0, 0, 0);
        this.context.clear(this.context.COLOR_BUFFER_BIT);
    }
}
