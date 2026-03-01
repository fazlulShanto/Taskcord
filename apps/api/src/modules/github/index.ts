import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import GithubRoute from "./github.route";
import { zodGithubSchemas } from "./github.schema";

export default fastifyPlugin(
    async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
        zodGithubSchemas.map((schema) => {
            fastify.addSchema(schema);
        });

        await fastify.register(GithubRoute, options);
    },
);
