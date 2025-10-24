import type { FastifyInstance } from "fastify";
import AuthService from "../auth/auth.service";
import UserController from "./user.controller";
import UserService from "./user.service";

export default function AuthRoute(fastify: FastifyInstance) {
    const userController = new UserController(
        new UserService(new AuthService())
    );

    fastify.get(
        "/@me",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["User"],
                description: "Get the current user data",
                response: {
                    200: { $ref: "meResponse" },
                    404: { $ref: "meErrorResponse" },
                },
            },
        },
        userController.me.bind(userController)
    );

    fastify.get(
        "/discord/guilds",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["User"],
                description:
                    "Get the current user's discord servers where user is owner or has admin permissions",
                response: {
                    200: { $ref: "discordServerListResponse" },
                },
            },
        },
        userController.getUserDiscordServerList.bind(userController)
    );

    if (["local", "staging"].includes(process.env.NODE_ENV)) {
        fastify.post<{ Querystring: { userCount: number } }>(
            "/dummy",
            {
                onRequest: [fastify.jwtAuth],
                schema: {
                    tags: ["User"],
                    description: "Create dummy users",
                    querystring: {
                        type: "object",
                        properties: {
                            userCount: { type: "number" },
                        },
                    },
                },
            },
            userController.createDummyUsers.bind(userController)
        );
    }
}
