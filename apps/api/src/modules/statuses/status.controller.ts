import type { FastifyReply, FastifyRequest } from "fastify";
import type StatusService from "./status.service";

export default class StatusController {
  constructor(private statusService: StatusService) {}

  async createStatus(
    request: FastifyRequest<{
      Body: {
        name: string;
        color: string;
        description: string;
        order: number;
      };
      Params: { projectId: string };
    }>,
    reply: FastifyReply,
  ) {
    const status = await this.statusService.createStatus({
      ...request.body,
      projectId: request.params.projectId,
      creatorId: request.jwtUser.id,
    });

    return reply.status(201).send({ status });
  }

  async getStatusById(
    request: FastifyRequest<{
      Params: { statusId: string };
    }>,
    reply: FastifyReply,
  ) {
    const status = await this.statusService.getStatusById(
      request.params.statusId,
    );

    if (!status) {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "Status not found",
      });
    }

    return reply.send({ status });
  }

  async getStatusesByProjectId(
    request: FastifyRequest<{
      Params: { projectId: string };
    }>,
    reply: FastifyReply,
  ) {
    const statuses = await this.statusService.getStatusesByProjectId(
      request.params.projectId,
    );

    return reply.send({ statuses });
  }

  async updateStatus(
    request: FastifyRequest<{
      Params: { statusId: string };
      Body: {
        name?: string;
        color?: string;
        description?: string;
        order?: number;
      };
    }>,
    reply: FastifyReply,
  ) {
    const status = await this.statusService.updateStatus(
      request.params.statusId,
      request.body,
    );

    return reply.send({ status });
  }

  async deleteStatus(
    request: FastifyRequest<{
      Params: { statusId: string };
    }>,
    reply: FastifyReply,
  ) {
    const status = await this.statusService.deleteStatus(
      request.params.statusId,
    );

    return reply.send({ status });
  }

  async deleteStatusBulk(
    request: FastifyRequest<{
      Body: { ids: string[] };
    }>,
    reply: FastifyReply,
  ) {
    const statuses = await this.statusService.deleteStatusBulk(
      request.body.ids,
    );

    return reply.send({ statuses });
  }
}
