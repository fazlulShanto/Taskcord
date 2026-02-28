import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import TaskRoute from "./task.route";
import { zodTaskSchemas } from "./task.schema";

export default fastifyPlugin(
    async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
        zodTaskSchemas.map((schema) => {
            fastify.addSchema(schema);
        });

        await fastify.register(TaskRoute, options);
    },
);
