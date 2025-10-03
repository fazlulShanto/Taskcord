import type { FastifyInstance } from "fastify";
import LabelController from "./label.controller";
import LabelService from "./label.service";
import { labelSchemas, labelSchemaRef } from "./label.schema";

export default function LabelsRoute(fastify: FastifyInstance) {
  // Register schemas
  for (const schema of labelSchemas) {
    fastify.addSchema(schema);
  }

  const labelController = new LabelController(new LabelService());

  // Create a new task label
  fastify.post(
    "/",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Task Labels"],
        description: "Create a new task label",
        body: labelSchemaRef("createLabelSchema"),
        response: {
          201: labelSchemaRef("labelResponse"),
          400: labelSchemaRef("errorResponse"),
        },
      },
    },
    // @ts-expect-error - this is a bug in fastify-zod
    labelController.createLabel.bind(labelController),
  );

  // Get all task labels of a project
  fastify.get(
    "/",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Task Labels"],
        description: "Get all task labels of a project",
        response: {
          200: labelSchemaRef("labelsResponse"),
        },
      },
    },
    // @ts-expect-error - this is a bug in fastify-zod
    labelController.getAllProjectLabels.bind(labelController),
  );

  // Update a task label
  fastify.put(
    "/:labelId",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Task Labels"],
        description: "Update a task label",
        body: labelSchemaRef("updateLabelSchema"),
        response: {
          200: labelSchemaRef("labelResponse"),
          400: labelSchemaRef("errorResponse"),
        },
      },
    },
    // @ts-expect-error - this is a bug in fastify-zod
    labelController.updateLabel.bind(labelController),
  );

  // Delete a task label
  fastify.delete(
    "/:labelId",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Task Labels"],
        description: "Delete a task label",
        response: {
          200: labelSchemaRef("labelResponse"),
          400: labelSchemaRef("errorResponse"),
        },
      },
    },
    // @ts-expect-error - this is a bug in fastify-zod
    labelController.deleteLabel.bind(labelController),
  );
}
