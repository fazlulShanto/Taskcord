import { zodSchemasToJSONSchema } from "@/utils/schemaHelper";
import { z } from "zod/v4";

const githubInitQuerySchema = z
    .object({
        project_id: z.string().uuid(),
        redirect_url: z.string().url().optional(),
    })
    .meta({ $id: "githubInitQuerySchema" });

const githubInitResponseSchema = z
    .object({
        url: z.string().url(),
    })
    .meta({ $id: "githubInitResponseSchema" });

const githubCallbackQuerySchema = z
    .object({
        installation_id: z.string().optional(),
        setup_action: z.string().optional(),
        state: z.string().min(8),
    })
    .meta({ $id: "githubCallbackQuerySchema" });

const githubProjectParamsSchema = z
    .object({
        projectId: z.string().uuid(),
    })
    .meta({ $id: "githubProjectParamsSchema" });

const githubRepositoryBodySchema = z
    .object({
        installationId: z.string().uuid().optional(),
        repositoryId: z.string().min(1),
        owner: z.string().min(1),
        name: z.string().min(1),
        fullName: z.string().min(3),
        defaultBranch: z.string().min(1).optional(),
        isPrivate: z.boolean().optional(),
    })
    .meta({ $id: "githubRepositoryBodySchema" });

const githubRepositoryResponseSchema = z
    .object({
        repository: z.object({
            id: z.string().uuid(),
            projectId: z.string().uuid(),
            installationId: z.string().uuid().nullable(),
            repositoryId: z.string(),
            owner: z.string(),
            name: z.string(),
            fullName: z.string(),
            defaultBranch: z.string(),
            isPrivate: z.boolean(),
            isActive: z.boolean(),
            lastSyncedAt: z.string().datetime().nullable(),
            createdAt: z.string().datetime().nullable(),
            updatedAt: z.string().datetime().nullable(),
        }),
    })
    .meta({ $id: "githubRepositoryResponseSchema" });

const githubRepositoriesResponseSchema = z
    .object({
        repositories: z.array(
            z.object({
                id: z.string().uuid(),
                projectId: z.string().uuid(),
                installationId: z.string().uuid().nullable(),
                repositoryId: z.string(),
                owner: z.string(),
                name: z.string(),
                fullName: z.string(),
                defaultBranch: z.string(),
                isPrivate: z.boolean(),
                isActive: z.boolean(),
                lastSyncedAt: z.string().datetime().nullable(),
                createdAt: z.string().datetime().nullable(),
                updatedAt: z.string().datetime().nullable(),
            }),
        ),
    })
    .meta({ $id: "githubRepositoriesResponseSchema" });

const githubWebhookResponseSchema = z
    .object({
        status: z.enum(["accepted", "duplicate", "invalid_signature"]),
    })
    .meta({ $id: "githubWebhookResponseSchema" });

export type GithubInitQuery = z.infer<typeof githubInitQuerySchema>;
export type GithubCallbackQuery = z.infer<typeof githubCallbackQuerySchema>;
export type GithubProjectParams = z.infer<typeof githubProjectParamsSchema>;
export type GithubRepositoryBody = z.infer<typeof githubRepositoryBodySchema>;

export const zodGithubSchemas = zodSchemasToJSONSchema([
    githubInitQuerySchema,
    githubInitResponseSchema,
    githubCallbackQuerySchema,
    githubProjectParamsSchema,
    githubRepositoryBodySchema,
    githubRepositoryResponseSchema,
    githubRepositoriesResponseSchema,
    githubWebhookResponseSchema,
]);
