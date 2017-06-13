attribute vec2 a_position;

// a global variable that will be initialized with the screen resolution,
// i.e. with canvas.width and canvas.height
uniform vec2 u_resolution;

void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = (zeroToOne * 2.0) - 1.0;    
    gl_Position = vec4(clipSpace, 0, 1);
}