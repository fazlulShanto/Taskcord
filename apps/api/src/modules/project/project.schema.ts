import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

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

const createProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  discordServerId: z.string(),
});

const updateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  managerId: z.string().optional(),
  status: z.string().optional(),
  logo: z.string().optional(),
  startingTimestamp: z.string().optional(),
  estimatedCompletionTimestamp: z.string().optional(),
});

const projectResponseSchema = z.object({
  project: z.object(projectCore),
});

const projectsResponseSchema = z.object({
  projects: z.array(z.object(projectCore)),
});

const errorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
});

const projectSchemaWithId = z.object({
  id: z.string().uuid(),
});
export const { schemas: projectSchemas, $ref: projectSchemaRef } =
  buildJsonSchemas(
    {
      createProjectSchema,
      updateProjectSchema,
      projectResponse: projectResponseSchema,
      projectsResponse: projectsResponseSchema,
      errorResponse: errorResponseSchema,
      projectSchemaWithId,
    } as const,
    { $id: "projectSchema" },
  );
