import { zodSchemasToJSONSchema } from "@/utils/schemaHelper";
import { z } from "zod/v4";

const ProjectTaskType = {
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    creatorId: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    order: z.number().int(),
};

const createTaskTypeSchema = z
    .object({
        name: z.string(),
        description: z.string().optional(),
        order: z.number().int().min(0).optional(),
    })
    .meta({ $id: "createTaskTypeSchema" });

const updateTaskTypeSchema = z
    .object({
        name: z.string().optional(),
        description: z.string().optional(),
        order: z.number().int().min(0).optional(),
    })
    .meta({ $id: "updateTaskTypeSchema" });

const taskTypeResponseSchema = z
    .object({
        taskType: z.object(ProjectTaskType),
    })
    .meta({ $id: "taskTypeResponse" });

const taskTypesResponseSchema = z
    .object({
        taskTypes: z.array(z.object(ProjectTaskType)),
    })
    .meta({ $id: "taskTypesResponse" });

const errorResponseSchema = z
    .object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
    })
    .meta({ $id: "taskTypeErrorResponse" });

const taskTypeSchemaWithId = z
    .object({
        taskTypeId: z.string().uuid(),
    })
    .meta({ $id: "taskTypeSchemaWithId" });

export type CreateTaskType = z.infer<typeof createTaskTypeSchema>;
export type UpdateTaskType = z.infer<typeof updateTaskTypeSchema>;

export const zodTaskTypeSchemas = zodSchemasToJSONSchema([
    createTaskTypeSchema,
    updateTaskTypeSchema,
    taskTypeResponseSchema,
    taskTypesResponseSchema,
    errorResponseSchema,
    taskTypeSchemaWithId,
]);
