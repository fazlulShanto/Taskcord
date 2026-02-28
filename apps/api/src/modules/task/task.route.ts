import type { FastifyInstance } from "fastify";
import TaskController from "./task.controller";
import type { CreateTask, UpdateTask } from "./task.schema";
import TaskService from "./task.service";

export default function TaskRoute(fastify: FastifyInstance) {
    const taskController = new TaskController(new TaskService());

    fastify.post<{ Body: CreateTask; Params: { projectId: string } }>(
        "/",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Tasks"],
                description: "Create a new task",
                body: { $ref: "createTaskSchema" },
                response: {
                    201: { $ref: "taskResponse" },
                    400: { $ref: "taskErrorResponse" },
                },
            },
        },
        taskController.createTask.bind(taskController),
    );

    fastify.get<{ Params: { projectId: string } }>(
        "/",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Tasks"],
                description: "Get all tasks of a project",
                params: {
                    type: "object",
                    properties: {
                        projectId: { type: "string" },
                    },
                    required: ["projectId"],
                },
                response: {
                    200: { $ref: "tasksResponse" },
                },
            },
        },
        taskController.getAllProjectTasks.bind(taskController),
    );

    fastify.get<{ Params: { taskId: string } }>(
        "/:taskId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Tasks"],
                description: "Get a task by id",
                params: { $ref: "taskSchemaWithId" },
                response: {
                    200: { $ref: "taskResponse" },
                    404: { $ref: "taskErrorResponse" },
                },
            },
        },
        taskController.getTask.bind(taskController),
    );

    fastify.put<{ Params: { taskId: string }; Body: UpdateTask }>(
        "/:taskId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Tasks"],
                description: "Update a task",
                params: { $ref: "taskSchemaWithId" },
                body: { $ref: "updateTaskSchema" },
                response: {
                    200: { $ref: "taskResponse" },
                    404: { $ref: "taskErrorResponse" },
                },
            },
        },
        taskController.updateTask.bind(taskController),
    );

    fastify.delete<{ Params: { taskId: string } }>(
        "/:taskId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Tasks"],
                description: "Delete a task",
                params: { $ref: "taskSchemaWithId" },
                response: {
                    200: { $ref: "taskResponse" },
                    404: { $ref: "taskErrorResponse" },
                },
            },
        },
        taskController.deleteTask.bind(taskController),
    );
}
