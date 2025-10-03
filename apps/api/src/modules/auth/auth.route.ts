import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import { authSchemaRef, authSchemas } from "./auth.schema";

export default function AuthRoute(fastify: FastifyInstance) {
  // Register schemas
  for (const schema of authSchemas) {
    fastify.addSchema(schema);
  }

  const authController = new AuthController(new AuthService());

  fastify.get(
    "/discord/init",
    {
      schema: {
        tags: ["Auth"],
        querystring: authSchemaRef("authInitQueryParams"),
        description: "Initialize the Discord auth flow",
      },
    },
    authController.initializeDiscordAuthFlowHandler.bind(authController),
  );

  fastify.get(
    "/discord/oauth-callback",
    {
      schema: {
        tags: ["Auth"],
        description: "Callback for the Discord auth flow",
        querystring: authSchemaRef("queryParams"),
        response: {
          200: authSchemaRef("200"),
        },
      },
    },
    authController.handleDiscordOAuthCallback.bind(authController),
  );
}
