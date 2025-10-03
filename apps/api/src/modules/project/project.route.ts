import type { FastifyInstance } from "fastify";
import { z } from "zod";
import GlobalUtils from "@/utils/golabalUtils";
import ProjectController from "./project.controller";
import ProjectService from "./project.service";
import { projectSchemaRef, projectSchemas } from "./project.schema";

export default function ProjectRoute(fastify: FastifyInstance) {
  // Register schemas
  for (const schema of projectSchemas) {
    fastify.addSchema(schema);
  }

  const projectController = new ProjectController(new ProjectService());

  // Create a new project
  fastify.post(
    "/",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Projects"],
        description: "Create a new project",
        body: projectSchemaRef("createProjectSchema"),
        response: {
          201: projectSchemaRef("projectResponse"),
          400: projectSchemaRef("errorResponse"),
        },
      },
    },
    // @ts-expect-error - this is a bug in fastify-zod
    projectController.createProject.bind(projectController),
  );

  // Get all projects
  fastify.get(
    "/",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Projects"],
        description: "Get all projects",
        response: {
          200: projectSchemaRef("projectsResponse"),
        },
      },
    },
    projectController.getAllProjects.bind(projectController),
  );

  // Get current user's projects
  //   fastify.get(
  //     "/me",
  //     {
  //       onRequest: [fastify.jwtAuth],
  //       schema: {
  //         tags: ["Projects"],
  //         description: "Get current user's projects",
  //         response: {
  //           200: projectSchemaRef("projectsResponse"),
  //         },
  //       },
  //     },
  //     projectController.getUserProjects.bind(projectController)
  //   );

  // Get a specific project by ID
  fastify.get(
    "/:id",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Projects"],
        description: "Get a project by ID",
        params: projectSchemaRef("projectSchemaWithId"),
        response: {
          200: projectSchemaRef("projectResponse"),
          404: projectSchemaRef("errorResponse"),
        },
      },
    },
    projectController.getProject.bind(projectController),
  );

  //   Update a project
  fastify.patch(
    "/:id",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Projects"],
        description: "Update a project",
        params: projectSchemaRef("projectSchemaWithId"),
        body: projectSchemaRef("updateProjectSchema"),
        response: {
          200: projectSchemaRef("projectResponse"),
          404: projectSchemaRef("errorResponse"),
        },
      },
    },
    projectController.updateProject.bind(projectController),
  );

  fastify.get(
    "/:server_id/is-bot-in-server",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Projects"],
        description: "Check if the bot is in a server",
        response: {
          200: GlobalUtils.zodToSchema({ ok: z.boolean() }),
          404: projectSchemaRef("errorResponse"),
        },
      },
    },
    projectController.isBotInServer.bind(projectController),
  );
  // Delete a project
  fastify.delete(
    "/:id",
    {
      onRequest: [fastify.jwtAuth],
      schema: {
        tags: ["Projects"],
        description: "Delete a project",
        params: projectSchemaRef("projectSchemaWithId"),
        response: {
          200: projectSchemaRef("projectResponse"),
          404: projectSchemaRef("errorResponse"),
        },
      },
    },
    projectController.deleteProject.bind(projectController),
  );
}
