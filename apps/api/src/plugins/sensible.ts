import { default as fastifyPlugin } from "fastify-plugin";
import { default as fastifySensible } from "@fastify/sensible";
import type { FastifyInstance } from "fastify";

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fastifyPlugin(async (fastify: FastifyInstance) => {
  await fastify.register(fastifySensible);
});
