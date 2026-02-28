import { zodSchemasToJSONSchema } from "@/utils/schemaHelper";
import { z } from "zod/v4";

const ProjectTask = {
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    creatorId: z.string().uuid(),
    status: z.string(),
    priority: z.string(),
    milestoneId: z.string().uuid().nullable(),
    assignees: z.array(z.string()),
    dueDate: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
};

const createTaskSchema = z
    .object({
        title: z.string(),
        description: z.string().optional(),
        status: z.string().optional(),
        priority: z.string().optional(),
        milestoneId: z.string().uuid().optional(),
        assignees: z.array(z.string().uuid()).optional(),
        dueDate: z.string().optional(),
    })
    .meta({ $id: "createTaskSchema" });

const updateTaskSchema = z
    .object({
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.string().optional(),
        priority: z.string().optional(),
        milestoneId: z.string().uuid().nullable().optional(),
        assignees: z.array(z.string().uuid()).optional(),
        dueDate: z.string().nullable().optional(),
    })
    .meta({ $id: "updateTaskSchema" });

const taskResponseSchema = z
    .object({
        task: z.object(ProjectTask),
    })
    .meta({ $id: "taskResponse" });

const tasksResponseSchema = z
    .object({
        tasks: z.array(z.object(ProjectTask)),
    })
    .meta({ $id: "tasksResponse" });

const errorResponseSchema = z
    .object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
    })
    .meta({ $id: "taskErrorResponse" });

const taskSchemaWithId = z
    .object({
        taskId: z.string().uuid(),
    })
    .meta({ $id: "taskSchemaWithId" });

export type CreateTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;

export const zodTaskSchemas = zodSchemasToJSONSchema([
    createTaskSchema,
    updateTaskSchema,
    taskResponseSchema,
    tasksResponseSchema,
    errorResponseSchema,
    taskSchemaWithId,
]);
