import { zodSchemasToJSONSchema } from "@/utils/schemaHelper";
import { z } from "zod/v4";

const ProjectTaskLabel = {
    id: z.string().uuid(),
    label: z.string(),
    color: z.string(),
    description: z.string(),
    projectId: z.string().uuid(),
    creatorId: z.string().uuid(),
};

const createLabelSchema = z
    .object({
        label: z.string(),
        color: z.string(),
        description: z.string(),
        // projectId: z.string().uuid(),
        // creatorId: z.string().uuid(),
    })
    .meta({ $id: "createLabelSchema" });

const updateLabelSchema = z
    .object({
        label: z.string().optional(),
        color: z.string().optional(),
        description: z.string().optional(),
        // projectId: z.string().uuid().optional(),
        // creatorId: z.string().uuid().optional(),
    })
    .meta({ $id: "updateLabelSchema" });

const taskLabelResponseSchema = z
    .object({
        taskLabel: z.object(ProjectTaskLabel),
    })
    .meta({ $id: "labelResponse" });

const taskLabelsResponseSchema = z
    .object({
        taskLabels: z.array(z.object(ProjectTaskLabel)),
    })
    .meta({ $id: "labelsResponse" });

const errorResponseSchema = z
    .object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
    })
    .meta({ $id: "labelErrorResponse" });

const labelSchemaWithId = z
    .object({
        id: z.string().uuid(),
    })
    .meta({ $id: "labelSchemaWithId" });

export type CreateLabel = z.infer<typeof createLabelSchema>;
export type UpdateLabel = z.infer<typeof updateLabelSchema>;
export type LabelResponse = z.infer<typeof taskLabelResponseSchema>;
export type LabelsResponse = z.infer<typeof taskLabelsResponseSchema>;
export type LabelErrorResponse = z.infer<typeof errorResponseSchema>;
export type LabelWithId = z.infer<typeof labelSchemaWithId>;

export const zodLabelSchemas = zodSchemasToJSONSchema([
    createLabelSchema,
    updateLabelSchema,
    taskLabelResponseSchema,
    taskLabelsResponseSchema,
    errorResponseSchema,
    labelSchemaWithId,
]);
