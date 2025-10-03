import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const ProjectStatus = {
  id: z.string().uuid(),
  name: z.string(),
  color: z.string(),
  description: z.string(),
  projectId: z.string().uuid(),
  creatorId: z.string().uuid(),
  order: z.number().int(),
};

const createStatusSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string(),
  description: z.string(),
  order: z.number().int().min(0),
});

const updateStatusSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

const statusResponseSchema = z.object({
  status: z.object(ProjectStatus),
});

const statusesResponseSchema = z.object({
  statuses: z.array(z.object(ProjectStatus)),
});

const errorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
});

const statusSchemaWithId = z.object({
  id: z.string().uuid(),
});

export const { schemas: statusSchemas, $ref: statusSchemaRef } =
  buildJsonSchemas(
    {
      createStatusSchema,
      updateStatusSchema,
      statusResponse: statusResponseSchema,
      statusesResponse: statusesResponseSchema,
      errorResponse: errorResponseSchema,
      statusSchemaWithId,
    } as const,
    { $id: "StatusSchema" },
  );
