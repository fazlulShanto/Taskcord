import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import StatusRoute from "./status.route";
import { zodStatusSchemas } from "./status.schema";

export default fastifyPlugin(
    async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
        zodStatusSchemas.map((schema) => {
            fastify.addSchema(schema);
        });

        await fastify.register(StatusRoute, options);
    }
);
