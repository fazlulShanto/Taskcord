import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import TaskTypeRoute from "./task-type.route";
import { zodTaskTypeSchemas } from "./task-type.schema";

export default fastifyPlugin(
    async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
        zodTaskTypeSchemas.map((schema) => {
            fastify.addSchema(schema);
        });

        await fastify.register(TaskTypeRoute, options);
    },
);
