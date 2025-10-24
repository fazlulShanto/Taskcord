import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import ProjectRoute from "./project.route";
import { zodProjectSchemas } from "./project.schema";

export default fastifyPlugin(
    async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
        zodProjectSchemas.map((schema) => {
            fastify.addSchema(schema);
        });

        await fastify.register(ProjectRoute, options);
    }
);
