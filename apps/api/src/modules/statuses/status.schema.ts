import { zodSchemasToJSONSchema } from "@/utils/schemaHelper";
import { z } from "zod/v4";

const ProjectStatus = {
    id: z.string().uuid(),
    name: z.string(),
    color: z.string(),
    description: z.string(),
    projectId: z.string().uuid(),
    creatorId: z.string().uuid(),
    order: z.number().int(),
};

const createStatusSchema = z
    .object({
        name: z.string().min(1).max(50),
        color: z.string(),
        description: z.string(),
        order: z.number().int().min(0),
    })
    .meta({ $id: "createStatusSchema" });

const updateStatusSchema = z
    .object({
        name: z.string().min(1).max(50).optional(),
        color: z.string().optional(),
        description: z.string().optional(),
        order: z.number().int().min(0).optional(),
    })
    .meta({ $id: "updateStatusSchema" });

const statusResponseSchema = z
    .object({
        status: z.object(ProjectStatus),
    })
    .meta({ $id: "statusResponse" });

const statusesResponseSchema = z
    .object({
        statuses: z.array(z.object(ProjectStatus)),
    })
    .meta({ $id: "statusesResponse" });

const errorResponseSchema = z
    .object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
    })
    .meta({ $id: "statusErrorResponse" });

const statusSchemaWithId = z
    .object({
        id: z.string().uuid(),
    })
    .meta({ $id: "statusSchemaWithId" });

export type CreateStatus = z.infer<typeof createStatusSchema>;
export type UpdateStatus = z.infer<typeof updateStatusSchema>;
export type StatusResponse = z.infer<typeof statusResponseSchema>;
export type StatusesResponse = z.infer<typeof statusesResponseSchema>;
export type StatusErrorResponse = z.infer<typeof errorResponseSchema>;
export type StatusWithId = z.infer<typeof statusSchemaWithId>;

export const zodStatusSchemas = zodSchemasToJSONSchema([
    createStatusSchema,
    updateStatusSchema,
    statusResponseSchema,
    statusesResponseSchema,
    errorResponseSchema,
    statusSchemaWithId,
]);
