// import { copyFile } from "node:fs/promises";
// import path from "node:path";
import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
    entryPoints: ["src/index.ts"],
    outDir: "dist",
    target: "es2020",
    clean: true,
    sourcemap: true,
    format: ["cjs"],
    ...options,
    // async onSuccess() {
    //     // Copy .env file
    //     await copyFile(
    //         path.join(__dirname, ".env"),
    //         path.join(__dirname, "../../build/api/.env")
    //     ).catch(() => {
    //         console.log("No .env file found to copy");
    //     });

    //     // Copy package.json
    //     await copyFile(
    //         path.join(__dirname, "package.json"),
    //         path.join(__dirname, "../../build/api/package.json")
    //     );
    // },
}));
