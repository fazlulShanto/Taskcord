import type { FastifyInstance } from "fastify";
import { fastifyCookie } from "@fastify/cookie";
import { fastifyPlugin } from "fastify-plugin";

export default fastifyPlugin(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifyCookie, {
      parseOptions: {},
    });
  },
  { name: "cookie", dependencies: ["env-config"] },
);
