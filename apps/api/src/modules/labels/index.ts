import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import LabelRoute from "./label.route";
import { zodLabelSchemas } from "./label.schema";

export default fastifyPlugin(
    async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
        zodLabelSchemas.map((schema) => {
            fastify.addSchema(schema);
        });

        await fastify.register(LabelRoute, options);
    }
);
