import { runMigrations } from "@taskcord/database";
import * as dotenv from "dotenv";
import type { FastifyInstance, FastifyServerOptions } from "fastify";
import Fastify from "fastify";
import type { Redis } from "ioredis";
import modules from "./modules";
import plugins from "./plugins";
import GlobalUtils from "./utils/golabalUtils";
import { CreateRedisClient } from "./utils/redis";

dotenv.config();

declare module "fastify" {
    interface FastifyRequest {
        cacheDb: Redis;
    }
    interface FastifyInstance {
        cacheDb: Redis;
    }
}

export default class TaskcordServer {
    private app: FastifyInstance | null = null;
    private serverOptions: FastifyServerOptions;

    constructor() {
        this.serverOptions = {
            logger: {
                level: "info",
                transport: {
                    target: "pino-pretty",
                    options: {
                        translateTime: "HH:MM:ss Z",
                        ignore: "pid,hostname",
                        singleLine: true,
                    },
                },
            },
        };
    }

    public async initialize(): Promise<void> {
        const redisUrl = GlobalUtils.getRedisUrl();
        const globalCacheDb = CreateRedisClient(redisUrl);
        this.app = Fastify(this.serverOptions) as FastifyInstance;
        this.app.decorate("cacheDb", globalCacheDb);

        await this.app.register(plugins);
        await this.app.register(modules, { prefix: "/api" });
    }

    public getApp(): FastifyInstance {
        if (!this.app) {
            throw new Error("Server not initialized. Call initialize() first.");
        }
        return this.app;
    }
}

export const startServer = async (): Promise<FastifyInstance> => {
    const port = process.env.PORT || 5001;
    const buildStart = performance.now();

    const serverInstance = new TaskcordServer();
    await serverInstance.initialize();
    const fastifyServer: FastifyInstance = serverInstance.getApp();

    try {
        console.log("✨".repeat(10), "STARTING SERVER", "✨".repeat(10));
        // check if cache & postgres are connected
        await fastifyServer.cacheDb.ping();

        // await checkConnection();
        // await generateMigration();
        await runMigrations();

        // seed user
        // SeedUserAndRoles("019c9e7b-c5a5-74b2-acfc-ec7319d5c943").catch(
        //     (err) => {
        //         console.error("❌ Seeding failed:", err);
        //         process.exit(1);
        //     },
        // );

        await fastifyServer.listen({ port: Number(port), host: "0.0.0.0" });

        const buildEnd = performance.now();
        console.log(
            `→ 📚 Check out API docs at http://localhost:${port}/api/docs`,
        );
        console.log(
            `🚀🚀 Server is ready to accept requests in ${(
                buildEnd - buildStart
            ).toFixed(2)} ms`,
        );
        return fastifyServer;
    } catch (e) {
        console.error("🛑 Error occured while building fastify");
        throw e;
    }
};
