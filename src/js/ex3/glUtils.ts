
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

    public clearCanvas() {
        this.context.clearColor(0, 0, 0, 0);
        this.context.clear(this.context.COLOR_BUFFER_BIT);
    }
}
