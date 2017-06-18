attribute vec2 a_position;

// a global variable that will be initialized with the screen resolution,
// i.e. with canvas.width and canvas.height
uniform vec2 u_resolution;
uniform vec2 u_translate;
uniform vec2 u_rotate;

void main() {
    vec2 rotated = vec2(
        a_position.x*u_rotate.x + a_position.y*u_rotate.y, 
        a_position.y*u_rotate.x - a_position.x*u_rotate.y);
    vec2 translated = rotated + u_translate;
    vec2 zeroToOne = translated / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;    
    gl_Position = vec4(clipSpace, 0, 1);
}