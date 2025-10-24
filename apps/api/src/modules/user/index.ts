import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import UserRoute from "./user.route";
import { zodUserSchemas } from "./user.schema";

export default fastifyPlugin(
    async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
        zodUserSchemas.map((schema) => {
            fastify.addSchema(schema);
        });

        await fastify.register(UserRoute, options);
    }
);
