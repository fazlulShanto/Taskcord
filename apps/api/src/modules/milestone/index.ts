import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import MilestoneRoute from "./milestone.route";
import { zodMilestoneSchemas } from "./milestone.schema";

export default fastifyPlugin(
    async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
        zodMilestoneSchemas.map((schema) => {
            fastify.addSchema(schema);
        });

        await fastify.register(MilestoneRoute, options);
    },
);
