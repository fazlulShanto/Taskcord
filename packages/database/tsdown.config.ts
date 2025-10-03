import { defineConfig } from "tsdown";

export default defineConfig((options) => ({
    entryPoints: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    target: "es2020",
    dts: true,
    sourcemap: true,
    clean: true,
    ...options,
}));
