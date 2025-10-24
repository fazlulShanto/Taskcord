import { fastifyCors } from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";

export default fastifyPlugin(
    async (fastify: FastifyInstance) => {
        const corsFromEnv = process.env.CORS_ORIGIN_LIST?.split(",").filter(
            (url) => url.length > 5
        ) ?? ["http://localhost:5173"];
        await fastify.register(fastifyCors, {
            credentials: true,
            origin: corsFromEnv,
        });
    },
    { name: "cors", dependencies: ["env-config"] }
);
