import M3 from "./Matrix3";

/**
 * A uniform for a t3 dimensional matrix
 */
interface IUniformMatrix3 {
    set(m3: M3): void;
}

export default IUniformMatrix3;