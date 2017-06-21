attribute vec2 a_position;

uniform vec2 u_translate;
uniform vec2 u_rotate;
uniform vec2 u_scale;

void main() {
    vec2 scaled = a_position * u_scale;
    vec2 rotated = vec2(
        scaled.x*u_rotate.x + scaled.y*u_rotate.y, 
        scaled.y*u_rotate.x - scaled.x*u_rotate.y);
    gl_Position = vec4(rotated + u_translate, 0, 1);
}