import type { FastifyInstance } from "fastify";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";

export default function AuthRoute(fastify: FastifyInstance) {
    const authController = new AuthController(new AuthService());

    fastify.get(
        "/discord/init",
        {
            schema: {
                tags: ["Auth"],
                querystring: { $ref: "authInitQueryParams" },
                description: "Initialize the Discord auth flow",
            },
        },
        authController.initializeDiscordAuthFlowHandler.bind(authController)
    );

    fastify.get(
        "/discord/oauth-callback",
        {
            schema: {
                tags: ["Auth"],
                description: "Callback for the Discord auth flow",
                querystring: { $ref: "queryParams" },
                response: {
                    200: { $ref: "200" },
                },
            },
        },
        authController.handleDiscordOAuthCallback.bind(authController)
    );
}
