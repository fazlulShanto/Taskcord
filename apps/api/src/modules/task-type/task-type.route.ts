import type { FastifyInstance } from "fastify";
import TaskTypeController from "./task-type.controller";
import type { CreateTaskType, UpdateTaskType } from "./task-type.schema";
import TaskTypeService from "./task-type.service";

export default function TaskTypeRoute(fastify: FastifyInstance) {
    const taskTypeController = new TaskTypeController(new TaskTypeService());

    fastify.post<{ Body: CreateTaskType; Params: { projectId: string } }>(
        "/",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Types"],
                description: "Create a new task type",
                body: { $ref: "createTaskTypeSchema" },
                response: {
                    201: { $ref: "taskTypeResponse" },
                    400: { $ref: "taskTypeErrorResponse" },
                },
            },
        },
        taskTypeController.createTaskType.bind(taskTypeController),
    );

    fastify.get<{ Params: { projectId: string } }>(
        "/",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Types"],
                description: "Get all task types of a project",
                params: {
                    type: "object",
                    properties: {
                        projectId: { type: "string" },
                    },
                    required: ["projectId"],
                },
                response: {
                    200: { $ref: "taskTypesResponse" },
                },
            },
        },
        taskTypeController.getAllProjectTaskTypes.bind(taskTypeController),
    );

    fastify.put<{ Params: { taskTypeId: string }; Body: UpdateTaskType }>(
        "/:taskTypeId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Types"],
                description: "Update a task type",
                body: { $ref: "updateTaskTypeSchema" },
                response: {
                    200: { $ref: "taskTypeResponse" },
                    400: { $ref: "taskTypeErrorResponse" },
                },
            },
        },
        taskTypeController.updateTaskType.bind(taskTypeController),
    );

    fastify.delete<{ Params: { taskTypeId: string } }>(
        "/:taskTypeId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Types"],
                description: "Delete a task type",
                params: {
                    type: "object",
                    properties: {
                        taskTypeId: { type: "string" },
                    },
                    required: ["taskTypeId"],
                },
                response: {
                    200: { $ref: "taskTypeResponse" },
                    400: { $ref: "taskTypeErrorResponse" },
                },
            },
        },
        taskTypeController.deleteTaskType.bind(taskTypeController),
    );

    fastify.delete<{ Body: { ids: string[] } }>(
        "/bulk",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Types"],
                description: "Delete multiple task types",
                body: {
                    type: "object",
                    properties: {
                        ids: { type: "array", items: { type: "string" } },
                    },
                },
            },
        },
        taskTypeController.deleteTaskTypeBulk.bind(taskTypeController),
    );
}
