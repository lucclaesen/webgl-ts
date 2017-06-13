require("../styles/app.css");
import * as ex1 from "./ex1/index";

ex1.simpleStaticTriangle();


// Satisfies ts and allows webpack to require non-js resources.
// declare var require: {
//     <T>(path: string): T;
//     (paths: string[], callback: (...modules: any[]) => void): void;
//     ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
// };