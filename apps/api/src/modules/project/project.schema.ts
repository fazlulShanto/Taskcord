import { zodSchemasToJSONSchema } from "@/utils/schemaHelper";
import { z } from "zod/v4";

const projectCore = {
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    creatorId: z.string().uuid(),
    managerId: z.string(),
    projectType: z.string(),
    status: z.string().nullable(),
    createdAt: z.date(),
    logo: z.string().nullable(),
    startingTimestamp: z.date().nullable(),
    estimatedCompletionTimestamp: z.date().nullable(),
    completedAt: z.date().nullable(),
};

const createProjectSchema = z
    .object({
        title: z.string(),
        description: z.string(),
        discordServerId: z.string(),
        projectType: z
            .enum(["general", "software", "marketing", "design"])
            .optional(),
    })
    .meta({ $id: "createProjectSchema" });

const updateProjectSchema = z
    .object({
        title: z.string().optional(),
        description: z.string().optional(),
        managerId: z.string().optional(),
        status: z.string().optional(),
        logo: z.string().optional(),
        startingTimestamp: z.string().optional(),
        estimatedCompletionTimestamp: z.string().optional(),
    })
    .meta({ $id: "updateProjectSchema" });

const projectResponseSchema = z
    .object({
        project: z.object(projectCore),
    })
    .meta({ $id: "projectResponse" });

const projectsResponseSchema = z
    .object({
        projects: z.array(z.object(projectCore)),
    })
    .meta({ $id: "projectsResponse" });

const errorResponseSchema = z
    .object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
    })
    .meta({ $id: "projectErrorResponse" });

const projectSchemaWithId = z
    .object({
        id: z.string().uuid(),
    })
    .meta({ $id: "projectSchemaWithId" });

const createProjectInviteSchema = z
    .object({
        roleId: z.string().uuid().optional(),
        inviteType: z.enum(["single_use", "multi_use"]).default("single_use"),
        maxUses: z.number().int().min(1).max(1000).optional(),
        expiresInHours: z
            .number()
            .int()
            .min(1)
            .max(24 * 30)
            .optional(),
        restrictionType: z
            .enum(["none", "email", "discord_id"])
            .default("none"),
        restrictedEmail: z.string().email().optional(),
        restrictedDiscordId: z.string().optional(),
    })
    .meta({ $id: "createProjectInviteSchema" });

const projectInviteParamsSchema = z
    .object({
        projectId: z.string().uuid(),
    })
    .meta({ $id: "projectInviteParamsSchema" });

const projectInviteIdParamsSchema = z
    .object({
        projectId: z.string().uuid(),
        inviteId: z.string().uuid(),
    })
    .meta({ $id: "projectInviteIdParamsSchema" });

const projectInviteCoreSchema = z.object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    inviterId: z.string().uuid(),
    roleId: z.string().uuid().nullable(),
    inviteType: z.string(),
    restrictionType: z.string(),
    restrictedEmail: z.string().nullable(),
    restrictedDiscordId: z.string().nullable(),
    maxUses: z.number(),
    usedCount: z.number(),
    expiresAt: z.date(),
    revokedAt: z.date().nullable(),
    lastAcceptedAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
});

const projectInviteCreateResponseSchema = z
    .object({
        invite: projectInviteCoreSchema,
        inviteToken: z.string(),
        authInitUrl: z.string(),
    })
    .meta({ $id: "projectInviteCreateResponse" });

const projectInvitesResponseSchema = z
    .object({
        invites: z.array(projectInviteCoreSchema),
    })
    .meta({ $id: "projectInvitesResponse" });

const projectInviteResponseSchema = z
    .object({
        invite: projectInviteCoreSchema,
    })
    .meta({ $id: "projectInviteResponse" });

const projectDefinedRoleCoreSchema = z.object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    roleName: z.string(),
    description: z.string().nullable(),
    permissionCode: z.string(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    creatorId: z.string().uuid(),
});

const projectDefinedRolesResponseSchema = z
    .object({
        roles: z.array(projectDefinedRoleCoreSchema),
    })
    .meta({ $id: "projectDefinedRolesResponse" });

const isBotInServerResponseSchema = z
    .object({
        ok: z.boolean(),
    })
    .meta({ $id: "isBotInServerResponse" });

export type CreateProject = z.infer<typeof createProjectSchema>;
export type CreateProjectSchemaType = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;
export type ProjectsResponse = z.infer<typeof projectsResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type ProjectWithId = z.infer<typeof projectSchemaWithId>;
export type IsBotInServerResponse = z.infer<typeof isBotInServerResponseSchema>;
export type CreateProjectInvite = z.infer<typeof createProjectInviteSchema>;
export type ProjectInviteParams = z.infer<typeof projectInviteParamsSchema>;
export type ProjectInviteIdParams = z.infer<typeof projectInviteIdParamsSchema>;

export const zodProjectSchemas = zodSchemasToJSONSchema([
    createProjectSchema,
    updateProjectSchema,
    projectResponseSchema,
    projectsResponseSchema,
    errorResponseSchema,
    projectSchemaWithId,
    isBotInServerResponseSchema,
    createProjectInviteSchema,
    projectInviteParamsSchema,
    projectInviteIdParamsSchema,
    projectInviteCreateResponseSchema,
    projectInvitesResponseSchema,
    projectInviteResponseSchema,
    projectDefinedRolesResponseSchema,
]);
