import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import utilityRoute from "./utility.route";
import { zodUtilitySchemas } from "./utility.schema";

export default fastifyPlugin(
    async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
        zodUtilitySchemas.map((schema) => {
            fastify.addSchema(schema);
        });

        await fastify.register(utilityRoute, options);
    }
);
