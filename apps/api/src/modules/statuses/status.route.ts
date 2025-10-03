import type { FastifyInstance } from "fastify";
import StatusController from "./status.controller";
import StatusService from "./status.service";
import { statusSchemas, statusSchemaRef } from "./status.schema";

export default function StatusRoutes(fastify: FastifyInstance) {
  // Register schemas
  for (const schema of statusSchemas) {
    fastify.addSchema(schema);
  }

  const statusController = new StatusController(new StatusService());

  // Create a new status
  fastify.post(
    "/",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Task Statuses"],
        description: "Create a new task status",
        body: statusSchemaRef("createStatusSchema"),
        response: {
          201: statusSchemaRef("statusResponse"),
          400: statusSchemaRef("errorResponse"),
        },
      },
    },
    // @ts-expect-error - this is a bug in fastify-zod
    statusController.createStatus.bind(statusController),
  );

  // Get all statuses of a project
  fastify.get(
    "/",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Task Statuses"],
        description: "Get all task statuses of a project",
        params: {
          type: "object",
          properties: {
            projectId: { type: "string" },
          },
          required: ["projectId"],
        },
        response: {
          200: statusSchemaRef("statusesResponse"),
        },
      },
    },
    // @ts-expect-error - this is a bug in fastify-zod
    statusController.getStatusesByProjectId.bind(statusController),
  );

  // Update a status
  fastify.put(
    "/:statusId",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Task Statuses"],
        description: "Update a task status",
        body: statusSchemaRef("updateStatusSchema"),
        response: {
          200: statusSchemaRef("statusResponse"),
          400: statusSchemaRef("errorResponse"),
        },
      },
    },
    // @ts-expect-error - this is a bug in fastify-zod
    statusController.updateStatus.bind(statusController),
  );

  // Delete a status
  fastify.delete(
    "/:statusId",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Task Statuses"],
        description: "Delete a task status",
        response: {
          200: statusSchemaRef("statusResponse"),
          400: statusSchemaRef("errorResponse"),
        },
      },
    },
    // @ts-expect-error - this is a bug in fastify-zod
    statusController.deleteStatus.bind(statusController),
  );

  // Delete multiple statuses
  fastify.delete(
    "/bulk",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Task Statuses"],
        description: "Delete multiple task statuses",
        body: {
          type: "object",
          properties: {
            ids: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
    // @ts-expect-error - this is a bug in fastify-zod
    statusController.deleteStatusBulk.bind(statusController),
  );
}
