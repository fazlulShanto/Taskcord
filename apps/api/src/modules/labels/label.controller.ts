import type { DbNewLabel } from "@taskcord/database";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateLabel, UpdateLabel } from "./label.schema";
import type LabelService from "./label.service";

export default class LabelController {
    private labelService: LabelService;

    constructor(labelService: LabelService) {
        this.labelService = labelService;
    }

    // Create a new label
    public async createLabel(
        request: FastifyRequest<{
            Body: CreateLabel;
            Params: { projectId: string };
        }>,
        reply: FastifyReply,
    ) {
        const labelData: DbNewLabel = {
            ...request.body,
            projectId: request.params.projectId,
            creatorId: request.jwtUser.id,
        };

        const label = await this.labelService.createLabel(labelData);

        return reply.code(201).send({ taskLabel: label });
    }

    public async getAllProjectLabels(
        request: FastifyRequest<{ Params: { projectId: string } }>,
        reply: FastifyReply,
    ) {
        const labels = await this.labelService.getAllLabelsByProjectId(
            request.params.projectId,
        );
        return reply.send({ taskLabels: labels });
    }

    public async updateLabel(
        request: FastifyRequest<{
            Params: { labelId: string };
            Body: UpdateLabel;
        }>,
        reply: FastifyReply,
    ) {
        const label = await this.labelService.updateLabel(
            request.params.labelId,
            request.body,
        );
        return reply.send({ taskLabel: label });
    }

    public async deleteLabel(
        request: FastifyRequest<{ Params: { labelId: string } }>,
        reply: FastifyReply,
    ) {
        const label = await this.labelService.deleteLabel(
            request.params.labelId,
        );
        return reply.send({ taskLabel: label });
    }

    public async deleteLabelBulk(
        request: FastifyRequest<{ Body: { ids: string[] } }>,
        reply: FastifyReply,
    ) {
        const labels = await this.labelService.deleteLabelBulk(
            request.body.ids,
        );
        return reply.send({ taskLabels: labels });
    }
}
