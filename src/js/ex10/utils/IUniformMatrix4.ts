import M4 from "./Matrix4";

/**
 * A uniform for a 4 dimensional matrix
 */
interface IUniformMatrix4 {
    set(m4: M4): void;
}

export default IUniformMatrix4;