import { defineConfig } from "tsdown";

export default defineConfig((options) => ({
    entryPoints: ["src/index.ts"],
    outDir: "dist",
    silent: true,
    clean: true,
    format: ["cjs"],
    ...options,
}));
