import type { FastifyInstance } from "fastify";
import StatusController from "./status.controller";
import { CreateStatus } from "./status.schema";
import StatusService from "./status.service";

export default function StatusRoutes(fastify: FastifyInstance) {
    const statusController = new StatusController(new StatusService());

    // Create a new status
    fastify.post<{ Body: CreateStatus; Params: { projectId: string } }>(
        "/",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Statuses"],
                description: "Create a new task status",
                params: {
                    type: "object",
                    properties: {
                        projectId: { type: "string" },
                    },
                    required: ["projectId"],
                },
                body: { $ref: "createStatusSchema" },
                response: {
                    201: { $ref: "statusResponse" },
                    400: { $ref: "statusErrorResponse" },
                },
            },
        },
        statusController.createStatus.bind(statusController)
    );

    // Get all statuses of a project
    fastify.get<{ Params: { projectId: string } }>(
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
                    200: { $ref: "statusesResponse" },
                },
            },
        },
        statusController.getStatusesByProjectId.bind(statusController)
    );

    // Update a status
    fastify.put<{
        Params: { statusId: string };
        Body: {
            name?: string;
            color?: string;
            description?: string;
            order?: number;
        };
    }>(
        "/:statusId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Statuses"],
                description: "Update a task status",
                params: {
                    type: "object",
                    properties: {
                        statusId: { type: "string" },
                    },
                    required: ["statusId"],
                },
                body: { $ref: "updateStatusSchema" },
                response: {
                    200: { $ref: "statusResponse" },
                    400: { $ref: "statusErrorResponse" },
                },
            },
        },
        statusController.updateStatus.bind(statusController)
    );

    // Delete a status
    fastify.delete<{ Params: { statusId: string } }>(
        "/:statusId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Statuses"],
                description: "Delete a task status",
                params: {
                    type: "object",
                    properties: {
                        statusId: { type: "string" },
                    },
                    required: ["statusId"],
                },
                response: {
                    200: { $ref: "statusResponse" },
                    400: { $ref: "statusErrorResponse" },
                },
            },
        },
        statusController.deleteStatus.bind(statusController)
    );

    // Delete multiple statuses
    fastify.delete<{ Body: { ids: string[] } }>(
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
        statusController.deleteStatusBulk.bind(statusController)
    );
}
