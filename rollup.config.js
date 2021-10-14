import ts from "@rollup/plugin-typescript";
import pkg from "./package.json";
export default {
    input:'./src/index.ts',
    output:[
        {
            format:'cjs',
            file:pkg.main
        },
        {
            format:'es',
            file:pkg.module
        }
    ],
    plugins:[ts()]
}