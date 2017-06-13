
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
        return this.createShaderFromSource(script.text, shaderType);
    }

    public createVertexShaderFromSource(source: string) {
        return this.createShaderFromSource(source, this.context.VERTEX_SHADER);
    }

    public createFragmentShaderFromSource(source: string) {
        return this.createShaderFromSource(source, this.context.FRAGMENT_SHADER);
    }

    private createShaderFromSource(
        source: string, 
        shaderType: number): WebGLProgram {    
        if (shaderType !== this.context.VERTEX_SHADER &&
            shaderType !== this.context.FRAGMENT_SHADER) {
            throw new Error(`${shaderType} is not a valid shader type.`);
        }

        var shader = this.context.createShader(shaderType);
        this.context.shaderSource(shader, source);
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

    /**
     * 
     * @param program 
     * @param vertices          
     * @param vertexSize        The number of elements from the input buffer to contribute to
     *                          a single vertex. E.g. a vertex with size 2 can represent a 2D point
     *                          or vector. 
     */
    public setInputVertices(program: WebGLProgram, vertices: number[], vertexSize: number): void {
        
        // sets up the buffer with data provides by the caller
        var positionBuffer = this.setupBuffer(program, vertices);

        // instructs gl how to use the buffer. i.e. the relation between the buffer and the
        // attribute a_position needs to be set up. 
        this.context.useProgram(program);
        var positionAttributeLocation = this.context.getAttribLocation(program, "a_position");
        this.context.enableVertexAttribArray(positionAttributeLocation);

        // probably not needed
        // this.context.bindBuffer(this.context.ARRAY_BUFFER, positionBuffer);

        // Here we need to instruct the vertex shader to iterate over the buffer, take 2 floats
        // upon every iteration and put them in a_position(0) and a_position(1)
        var size = 2;   // 2 coordinates for one vertex / iteration. The remaining 2 elements from
                        // vec4 are filled by 0
        var type = this.context.FLOAT;  // coordinate number type
        var normalize = false;
        var stride = 0; // with stride 0, the vertex shader will move forward size * (sizeof(type))
        var offset = 0; 
        this.context.vertexAttribPointer(
            positionAttributeLocation,
            vertexSize,
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
