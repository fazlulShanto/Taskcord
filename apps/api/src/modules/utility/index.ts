import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import utilityRoute from "./utility.route";
import { utilitySchemas } from "./utility.schema";

export default fastifyPlugin(
  async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    for (const schema of utilitySchemas) {
      fastify.addSchema(schema);
    }

    await fastify.register(utilityRoute, options);
  },
);
