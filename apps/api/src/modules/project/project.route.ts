import type { FastifyInstance } from "fastify";
import ProjectController, { CreateProject } from "./project.controller";
import ProjectService from "./project.service";

export default function ProjectRoute(fastify: FastifyInstance) {
    const projectController = new ProjectController(new ProjectService());

    // Create a new project
    fastify.post<{
        Body: CreateProject;
    }>(
        "/",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Projects"],
                description: "Create a new project",
                body: { $ref: "createProjectSchema" },
                response: {
                    201: { $ref: "projectResponse" },
                    400: { $ref: "projectErrorResponse" },
                },
            },
        },
        projectController.createProject.bind(projectController)
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
                    200: { $ref: "projectsResponse" },
                },
            },
        },
        projectController.getAllProjects.bind(projectController)
    );

    // Get a specific project by ID
    fastify.get(
        "/:id",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Projects"],
                description: "Get a project by ID",
                params: { $ref: "projectSchemaWithId" },
                response: {
                    200: { $ref: "projectResponse" },
                    404: { $ref: "projectErrorResponse" },
                },
            },
        },
        projectController.getProject.bind(projectController)
    );

    // Update a project
    fastify.patch(
        "/:id",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Projects"],
                description: "Update a project",
                params: { $ref: "projectSchemaWithId" },
                body: { $ref: "updateProjectSchema" },
                response: {
                    200: { $ref: "projectResponse" },
                    404: { $ref: "projectErrorResponse" },
                },
            },
        },
        projectController.updateProject.bind(projectController)
    );

    fastify.get(
        "/:server_id/is-bot-in-server",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Projects"],
                description: "Check if the bot is in a server",
                response: {
                    200: { $ref: "isBotInServerResponse" },
                    404: { $ref: "projectErrorResponse" },
                },
            },
        },
        projectController.isBotInServer.bind(projectController)
    );

    // Delete a project
    fastify.delete(
        "/:id",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Projects"],
                description: "Delete a project",
                params: { $ref: "projectSchemaWithId" },
                response: {
                    200: { $ref: "projectResponse" },
                    404: { $ref: "projectErrorResponse" },
                },
            },
        },
        projectController.deleteProject.bind(projectController)
    );
}
