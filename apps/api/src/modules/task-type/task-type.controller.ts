import type { DbNewTaskType } from "@taskcord/database";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateTaskType, UpdateTaskType } from "./task-type.schema";
import type TaskTypeService from "./task-type.service";

export default class TaskTypeController {
    private taskTypeService: TaskTypeService;

    constructor(taskTypeService: TaskTypeService) {
        this.taskTypeService = taskTypeService;
    }

    public async createTaskType(
        request: FastifyRequest<{
            Body: CreateTaskType;
            Params: { projectId: string };
        }>,
        reply: FastifyReply,
    ) {
        const taskTypeData: DbNewTaskType = {
            ...request.body,
            projectId: request.params.projectId,
            creatorId: request.jwtUser.id,
            order: request.body.order ?? 0,
        };

        const taskType =
            await this.taskTypeService.createTaskType(taskTypeData);

        return reply.code(201).send({ taskType });
    }

    public async getAllProjectTaskTypes(
        request: FastifyRequest<{ Params: { projectId: string } }>,
        reply: FastifyReply,
    ) {
        const taskTypes = await this.taskTypeService.getTaskTypesByProjectId(
            request.params.projectId,
        );
        return reply.send({ taskTypes });
    }

    public async updateTaskType(
        request: FastifyRequest<{
            Params: { taskTypeId: string };
            Body: UpdateTaskType;
        }>,
        reply: FastifyReply,
    ) {
        const taskType = await this.taskTypeService.updateTaskType(
            request.params.taskTypeId,
            request.body,
        );
        return reply.send({ taskType });
    }

    public async deleteTaskType(
        request: FastifyRequest<{ Params: { taskTypeId: string } }>,
        reply: FastifyReply,
    ) {
        const taskType = await this.taskTypeService.deleteTaskType(
            request.params.taskTypeId,
        );
        return reply.send({ taskType });
    }

    public async deleteTaskTypeBulk(
        request: FastifyRequest<{ Body: { ids: string[] } }>,
        reply: FastifyReply,
    ) {
        const taskTypes = await this.taskTypeService.deleteTaskTypeBulk(
            request.body.ids,
        );
        return reply.send({ taskTypes });
    }
}
