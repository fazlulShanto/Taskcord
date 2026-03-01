import {
    GithubInstallationsDal,
    GithubProjectInstallationsDal,
    GithubProjectRepositoriesDal,
    GithubWebhookDeliveriesDal,
} from "@taskcord/database";
import type { FastifyReply, FastifyRequest } from "fastify";
import type {
    GithubCallbackQuery,
    GithubInitQuery,
    GithubProjectParams,
    GithubRepositoryBody,
} from "./github.schema";
import type GithubService from "./github.service";

export default class GithubController {
    private githubService: GithubService;

    constructor(githubService: GithubService) {
        this.githubService = githubService;
    }

    public async initializeGithubConnectHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const query = request.query as GithubInitQuery;
        const clientRedirectUrl = this.githubService.resolveClientRedirectUrl(
            query.redirect_url,
        );
        const state = this.githubService.buildOAuthState({
            redirectUrl: clientRedirectUrl,
            projectId: query.project_id,
            userId: request.jwtUser.id,
        });

        await request.server.cacheDb.setex(
            `github:oauth_state:${state}`,
            10 * 60,
            "1",
        );

        const url = this.githubService.getGithubInstallUrl(state);
        return reply.send({ url });
    }

    public async handleGithubInstallCallback(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const query = request.query as GithubCallbackQuery;
        const { state, installation_id, setup_action } = query;

        const storedState = await request.server.cacheDb.get(
            `github:oauth_state:${state}`,
        );
        if (!storedState) {
            return reply.unauthorized("Invalid or expired OAuth state");
        }

        await request.server.cacheDb.del(`github:oauth_state:${state}`);

        const parsedState = this.githubService.parseOAuthState(state);
        let installationDbId = "";

        if (installation_id) {
            const installation =
                await GithubInstallationsDal.upsertInstallation({
                    githubInstallationId: installation_id,
                    appSlug: process.env.GITHUB_APP_NAME,
                    createdByUserId: parsedState.userId,
                    isActive: true,
                });

            installationDbId = installation.id;

            await GithubProjectInstallationsDal.upsertProjectInstallation({
                projectId: parsedState.projectId,
                installationId: installation.id,
                linkedByUserId: parsedState.userId,
            });
        }

        const redirectUrl = new URL(parsedState.redirectUrl);
        redirectUrl.searchParams.set(
            "github_connected",
            installation_id ? "1" : "0",
        );
        redirectUrl.searchParams.set("project_id", parsedState.projectId);
        redirectUrl.searchParams.set("setup_action", setup_action ?? "");
        redirectUrl.searchParams.set("installation_id", installation_id ?? "");
        redirectUrl.searchParams.set("installation_db_id", installationDbId);

        return reply.redirect(redirectUrl.toString());
    }

    public async getProjectRepositoriesHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const { projectId } = request.params as GithubProjectParams;
        const repositories =
            await GithubProjectRepositoriesDal.getProjectRepositories(
                projectId,
            );

        return reply.send({ repositories });
    }

    public async upsertProjectRepositoryHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const { projectId } = request.params as GithubProjectParams;
        const body = request.body as GithubRepositoryBody;

        const repository =
            await GithubProjectRepositoriesDal.upsertProjectRepository({
                projectId,
                installationId: body.installationId,
                repositoryId: body.repositoryId,
                owner: body.owner,
                name: body.name,
                fullName: body.fullName,
                defaultBranch: body.defaultBranch,
                isPrivate: body.isPrivate,
            });

        return reply.code(201).send({ repository });
    }

    public async githubWebhookHandler(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const deliveryId = request.headers["x-github-delivery"] as
            | string
            | undefined;
        const eventType =
            (request.headers["x-github-event"] as string | undefined) ??
            "unknown";
        const signature = request.headers["x-hub-signature-256"] as
            | string
            | undefined;
        const payloadString =
            typeof request.body === "string"
                ? request.body
                : JSON.stringify(request.body ?? {});

        if (!deliveryId) {
            return reply.badRequest("Missing x-github-delivery header");
        }

        const existingDelivery =
            await GithubWebhookDeliveriesDal.getByDeliveryId(deliveryId);
        if (existingDelivery) {
            return reply.code(202).send({ status: "duplicate" });
        }

        const shouldVerifySignature = Boolean(
            process.env.GITHUB_WEBHOOK_SECRET,
        );
        const signatureVerified = shouldVerifySignature
            ? this.githubService.verifyWebhookSignature(
                  payloadString,
                  signature,
              )
            : false;

        await GithubWebhookDeliveriesDal.createDelivery({
            deliveryId,
            eventType,
            signatureVerified,
            payload: payloadString,
            status: signatureVerified ? "received" : "failed",
        });

        if (shouldVerifySignature && !signatureVerified) {
            await GithubWebhookDeliveriesDal.markDeliveryProcessed(
                deliveryId,
                "failed",
                "Invalid webhook signature",
            );
            return reply.code(401).send({ status: "invalid_signature" });
        }

        await GithubWebhookDeliveriesDal.markDeliveryProcessed(
            deliveryId,
            "accepted",
        );

        return reply.code(202).send({ status: "accepted" });
    }
}
