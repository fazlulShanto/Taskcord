import type { FastifyInstance } from "fastify";
import GithubController from "./github.controller";
import GithubService from "./github.service";

export default function GithubRoute(fastify: FastifyInstance) {
    const githubController = new GithubController(new GithubService());

    fastify.get(
        "/init",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["GitHub"],
                description: "Initialize GitHub App installation flow",
                querystring: { $ref: "githubInitQuerySchema" },
                response: {
                    200: { $ref: "githubInitResponseSchema" },
                },
            },
        },
        githubController.initializeGithubConnectHandler.bind(githubController),
    );

    fastify.get(
        "/callback",
        {
            schema: {
                tags: ["GitHub"],
                description: "GitHub App installation callback",
                querystring: { $ref: "githubCallbackQuerySchema" },
            },
        },
        githubController.handleGithubInstallCallback.bind(githubController),
    );

    fastify.get(
        "/projects/:projectId/repositories",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["GitHub"],
                description: "List repositories linked to a project",
                params: { $ref: "githubProjectParamsSchema" },
                response: {
                    200: { $ref: "githubRepositoriesResponseSchema" },
                },
            },
        },
        githubController.getProjectRepositoriesHandler.bind(githubController),
    );

    fastify.post(
        "/projects/:projectId/repositories",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["GitHub"],
                description: "Link a repository to a project",
                params: { $ref: "githubProjectParamsSchema" },
                body: { $ref: "githubRepositoryBodySchema" },
                response: {
                    201: { $ref: "githubRepositoryResponseSchema" },
                },
            },
        },
        githubController.upsertProjectRepositoryHandler.bind(githubController),
    );

    fastify.post(
        "/webhook",
        {
            schema: {
                tags: ["GitHub"],
                description: "GitHub webhook receiver",
                response: {
                    202: { $ref: "githubWebhookResponseSchema" },
                    401: { $ref: "githubWebhookResponseSchema" },
                },
            },
        },
        githubController.githubWebhookHandler.bind(githubController),
    );
}
