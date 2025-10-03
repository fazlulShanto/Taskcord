import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const ProjectTaskLabel = {
  id: z.string().uuid(),
  label: z.string(),
  color: z.string(),
  description: z.string(),
  projectId: z.string().uuid(),
  creatorId: z.string().uuid(),
};

const createLabelSchema = z.object({
  label: z.string(),
  color: z.string(),
  description: z.string(),
  // projectId: z.string().uuid(),
  // creatorId: z.string().uuid(),
});

const updateLabelSchema = z.object({
  label: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  // projectId: z.string().uuid().optional(),
  // creatorId: z.string().uuid().optional(),
});

const taskLabelResponseSchema = z.object({
  taskLabel: z.object(ProjectTaskLabel),
});

const taskLabelsResponseSchema = z.object({
  taskLabels: z.array(z.object(ProjectTaskLabel)),
});

const errorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
});

const labelSchemaWithId = z.object({
  id: z.string().uuid(),
});
export const { schemas: labelSchemas, $ref: labelSchemaRef } = buildJsonSchemas(
  {
    createLabelSchema,
    updateLabelSchema,
    labelResponse: taskLabelResponseSchema,
    labelsResponse: taskLabelsResponseSchema,
    errorResponse: errorResponseSchema,
    labelSchemaWithId,
  } as const,
  { $id: "LabelSchema" },
);
