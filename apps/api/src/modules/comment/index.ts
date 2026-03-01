import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import CommentRoute from "./comment.route";
import { zodCommentSchemas } from "./comment.schema";

export default fastifyPlugin(
    async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
        zodCommentSchemas.map((schema) => {
            fastify.addSchema(schema);
        });

        await fastify.register(CommentRoute, options);
    },
);
