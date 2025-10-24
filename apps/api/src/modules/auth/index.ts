import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import AuthRoute from "./auth.route";
import { zodAuthSchemas } from "./auth.schema";

export default fastifyPlugin(
    async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
        zodAuthSchemas.map((schema) => {
            fastify.addSchema(schema);
        });

        await fastify.register(AuthRoute, options);
    }
);
