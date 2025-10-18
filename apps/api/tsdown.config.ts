// import { copyFile } from "node:fs/promises";
// import path from "node:path";
import { defineConfig } from "tsdown";

export default defineConfig((options) => ({
    entryPoints: ["src/index.ts"],
    outDir: "dist",
    target: "es2020",
    clean: true,
    sourcemap: true,
    format: ["cjs"],
    ...options,
}));
