import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import utility from "./utility";
import auth from "./auth";
import userRoutes from "./user";
import project from "./project";
import labels from "./labels";
import statuses from "./statuses";

const getOptionsWithPrefix = (
  options: FastifyPluginOptions,
  prefix: string,
) => {
  return {
    ...options,
    prefix: options.prefix + prefix,
  };
};

export default fastifyPlugin(
  async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    await Promise.all([
      fastify.register(
        utility,
        getOptionsWithPrefix(options, "/stable/utility"),
      ),
      fastify.register(auth, getOptionsWithPrefix(options, "/edge/auth")),
      fastify.register(
        userRoutes,
        getOptionsWithPrefix(options, "/edge/users"),
      ),
      fastify.register(project, getOptionsWithPrefix(options, "/edge/project")),
      fastify.register(
        labels,
        getOptionsWithPrefix(options, "/edge/projects/:projectId/labels"),
      ),
      fastify.register(
        statuses,
        getOptionsWithPrefix(options, "/edge/projects/:projectId/statuses"),
      ),
    ]);
  },
);
