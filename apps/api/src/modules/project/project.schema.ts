import { zodSchemasToJSONSchema } from "@/utils/schemaHelper";
import { z } from "zod/v4";

const projectCore = {
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    creatorId: z.string().uuid(),
    managerId: z.string(),
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

export const zodProjectSchemas = zodSchemasToJSONSchema([
    createProjectSchema,
    updateProjectSchema,
    projectResponseSchema,
    projectsResponseSchema,
    errorResponseSchema,
    projectSchemaWithId,
    isBotInServerResponseSchema,
]);
