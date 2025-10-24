import type { DbNewLabel } from "@taskcord/database";
import type { FastifyReply, FastifyRequest } from "fastify";
import type LabelService from "./label.service";

export default class LabelController {
    private labelService: LabelService;

    constructor(labelService: LabelService) {
        this.labelService = labelService;
    }

    // Create a new label
    public async createLabel(
        request: FastifyRequest<{ Body: DbNewLabel }>,
        reply: FastifyReply
    ) {
        const labelData = request.body;

        const label = await this.labelService.createLabel(labelData);

        return reply.code(201).send({ taskLabel: label });
    }

    public async getAllProjectLabels(
        request: FastifyRequest<{ Params: { projectId: string } }>,
        reply: FastifyReply
    ) {
        const labels = await this.labelService.getAllLabelsByProjectId(
            request.params.projectId
        );
        return reply.send({ taskLabels: labels });
    }

    public async updateLabel(
        request: FastifyRequest<{
            Params: { labelId: string };
            Body: DbNewLabel;
        }>,
        reply: FastifyReply
    ) {
        const labelData = request.body;
        const label = await this.labelService.updateLabel(
            request.params.labelId,
            labelData
        );
        return reply.send({ taskLabel: label });
    }

    public async deleteLabel(
        request: FastifyRequest<{ Params: { labelId: string } }>,
        reply: FastifyReply
    ) {
        const label = await this.labelService.deleteLabel(
            request.params.labelId
        );
        return reply.send({ taskLabel: label });
    }
}
