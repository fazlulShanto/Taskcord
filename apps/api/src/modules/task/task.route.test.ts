import taskModule from "@/modules/task";
import TaskService from "@/modules/task/task.service";
import { fastifySensible } from "@fastify/sensible";
import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("TaskRoute", () => {
    let app: FastifyInstance;

    beforeEach(async () => {
        vi.restoreAllMocks();
        app = Fastify();

        app.decorate(
            "jwtAuth",
            async (
                request: FastifyRequest & {
                    jwtUser?: { id: string };
                },
            ) => {
                request.jwtUser = {
                    id: "0194f7ca-f67f-7a60-9a48-2412f9f2fd00",
                    discordId: "discord-user-id",
                    fullName: "Test User",
                    avatar: "https://example.com/avatar.png",
                    email: "test@example.com",
                    iat: 1767225600,
                    exp: 1767312000,
                };
            },
        );

        await app.register(fastifySensible);
        await app.register(taskModule, {
            prefix: "/api/edge/projects/:projectId/tasks",
        });
        await app.ready();
    });

    afterEach(async () => {
        await app.close();
    });

    it("creates task", async () => {
        const task = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "Setup CI",
            description: "Prepare pipeline",
            creatorId: "0194f7ca-f67f-7a60-9a48-2412f9f2fd00",
            status: "TODO",
            priority: "MEDIUM",
            milestoneId: null,
            assignees: [],
            dueDate: new Date("2026-01-15T00:00:00.000Z"),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        vi.spyOn(TaskService.prototype, "createTask").mockResolvedValue(
            task as never,
        );

        const response = await app.inject({
            method: "POST",
            url: "/api/edge/projects/0194f7ca-f67f-7a60-9a48-2412f9f2fdc7/tasks",
            payload: {
                title: "Setup CI",
                description: "Prepare pipeline",
                dueDate: "2026-01-15T00:00:00.000Z",
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toHaveProperty("task");
    });

    it("gets all project tasks", async () => {
        const tasks = [
            {
                id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
                projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
                title: "Setup CI",
                description: null,
                creatorId: "0194f7ca-f67f-7a60-9a48-2412f9f2fd00",
                status: "TODO",
                priority: "MEDIUM",
                milestoneId: null,
                assignees: [],
                dueDate: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        vi.spyOn(
            TaskService.prototype,
            "getTasksByProjectId",
        ).mockResolvedValue(tasks as never);

        const response = await app.inject({
            method: "GET",
            url: "/api/edge/projects/0194f7ca-f67f-7a60-9a48-2412f9f2fdc7/tasks",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toHaveProperty("tasks");
        expect(response.json().tasks).toHaveLength(1);
    });

    it("gets task by id", async () => {
        const task = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "Setup CI",
            description: null,
            creatorId: "0194f7ca-f67f-7a60-9a48-2412f9f2fd00",
            status: "TODO",
            priority: "MEDIUM",
            milestoneId: null,
            assignees: [],
            dueDate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        vi.spyOn(TaskService.prototype, "getTaskById").mockResolvedValue(
            task as never,
        );

        const response = await app.inject({
            method: "GET",
            url: "/api/edge/projects/0194f7ca-f67f-7a60-9a48-2412f9f2fdc7/tasks/0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toHaveProperty("task");
    });

    it("returns 404 when task does not exist on get", async () => {
        vi.spyOn(TaskService.prototype, "getTaskById").mockResolvedValue(null);

        const response = await app.inject({
            method: "GET",
            url: "/api/edge/projects/0194f7ca-f67f-7a60-9a48-2412f9f2fdc7/tasks/0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
        });

        expect(response.statusCode).toBe(404);
        expect(response.json().message).toBe("Task not found");
    });

    it("updates a task", async () => {
        const task = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "Setup CI Updated",
            description: "Pipeline and checks",
            creatorId: "0194f7ca-f67f-7a60-9a48-2412f9f2fd00",
            status: "IN_PROGRESS",
            priority: "HIGH",
            milestoneId: null,
            assignees: [],
            dueDate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        vi.spyOn(TaskService.prototype, "updateTask").mockResolvedValue(
            task as never,
        );

        const response = await app.inject({
            method: "PUT",
            url: "/api/edge/projects/0194f7ca-f67f-7a60-9a48-2412f9f2fdc7/tasks/0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            payload: {
                title: "Setup CI Updated",
                status: "IN_PROGRESS",
                priority: "HIGH",
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toHaveProperty("task");
    });

    it("returns 404 when task does not exist on update", async () => {
        vi.spyOn(TaskService.prototype, "updateTask").mockResolvedValue(null);

        const response = await app.inject({
            method: "PUT",
            url: "/api/edge/projects/0194f7ca-f67f-7a60-9a48-2412f9f2fdc7/tasks/0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            payload: {
                title: "Setup CI Updated",
            },
        });

        expect(response.statusCode).toBe(404);
        expect(response.json().message).toBe("Task not found");
    });

    it("deletes a task", async () => {
        const task = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "Setup CI",
            description: null,
            creatorId: "0194f7ca-f67f-7a60-9a48-2412f9f2fd00",
            status: "TODO",
            priority: "MEDIUM",
            milestoneId: null,
            assignees: [],
            dueDate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        vi.spyOn(TaskService.prototype, "deleteTask").mockResolvedValue(
            task as never,
        );

        const response = await app.inject({
            method: "DELETE",
            url: "/api/edge/projects/0194f7ca-f67f-7a60-9a48-2412f9f2fdc7/tasks/0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toHaveProperty("task");
    });

    it("returns 404 when task does not exist on delete", async () => {
        vi.spyOn(TaskService.prototype, "deleteTask").mockResolvedValue(null);

        const response = await app.inject({
            method: "DELETE",
            url: "/api/edge/projects/0194f7ca-f67f-7a60-9a48-2412f9f2fdc7/tasks/0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
        });

        expect(response.statusCode).toBe(404);
        expect(response.json().message).toBe("Task not found");
    });
});
