import type { DbNewTask } from "@taskcord/database";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateTask, UpdateTask } from "./task.schema";
import type TaskService from "./task.service";

export default class TaskController {
    private taskService: TaskService;

    constructor(taskService: TaskService) {
        this.taskService = taskService;
    }

    public async createTask(
        request: FastifyRequest<{
            Body: CreateTask;
            Params: { projectId: string };
        }>,
        reply: FastifyReply,
    ) {
        const taskData: DbNewTask = {
            projectId: request.params.projectId,
            title: request.body.title,
            description: request.body.description,
            creatorId: request.jwtUser.id,
            status: request.body.status ?? "TODO",
            priority: request.body.priority ?? "MEDIUM",
            milestoneId: request.body.milestoneId,
            assignees: request.body.assignees ?? [],
            dueDate: request.body.dueDate
                ? new Date(request.body.dueDate)
                : null,
        };

        const task = await this.taskService.createTask(taskData);

        return reply.code(201).send({ task });
    }

    public async getAllProjectTasks(
        request: FastifyRequest<{ Params: { projectId: string } }>,
        reply: FastifyReply,
    ) {
        const tasks = await this.taskService.getTasksByProjectId(
            request.params.projectId,
        );
        return reply.send({ tasks });
    }

    public async getTask(
        request: FastifyRequest<{ Params: { taskId: string } }>,
        reply: FastifyReply,
    ) {
        const task = await this.taskService.getTaskById(request.params.taskId);

        if (!task) {
            return reply.notFound("Task not found");
        }

        return reply.send({ task });
    }

    public async updateTask(
        request: FastifyRequest<{
            Params: { taskId: string };
            Body: UpdateTask;
        }>,
        reply: FastifyReply,
    ) {
        const taskPayload: Partial<DbNewTask> = {
            title: request.body.title,
            description: request.body.description,
            status: request.body.status,
            priority: request.body.priority,
            milestoneId: request.body.milestoneId,
            assignees: request.body.assignees,
        };

        if (request.body.dueDate !== undefined) {
            taskPayload.dueDate = request.body.dueDate
                ? new Date(request.body.dueDate)
                : null;
        }

        const task = await this.taskService.updateTask(
            request.params.taskId,
            taskPayload,
        );

        if (!task) {
            return reply.notFound("Task not found");
        }

        return reply.send({ task });
    }

    public async deleteTask(
        request: FastifyRequest<{ Params: { taskId: string } }>,
        reply: FastifyReply,
    ) {
        const task = await this.taskService.deleteTask(request.params.taskId);

        if (!task) {
            return reply.notFound("Task not found");
        }

        return reply.send({ task });
    }
}
