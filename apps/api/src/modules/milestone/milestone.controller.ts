import type { DbNewMilestone } from "@taskcord/database";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateMilestone, UpdateMilestone } from "./milestone.schema";
import type MilestoneService from "./milestone.service";

export default class MilestoneController {
    private milestoneService: MilestoneService;

    constructor(milestoneService: MilestoneService) {
        this.milestoneService = milestoneService;
    }

    public async createMilestone(
        request: FastifyRequest<{
            Body: CreateMilestone;
            Params: { projectId: string };
        }>,
        reply: FastifyReply,
    ) {
        const milestoneData: DbNewMilestone = {
            projectId: request.params.projectId,
            title: request.body.title,
            description: request.body.description,
            startDate: request.body.startDate
                ? new Date(request.body.startDate)
                : null,
            endDate: request.body.endDate
                ? new Date(request.body.endDate)
                : null,
            status: request.body.status ?? "pending",
        };

        const milestone =
            await this.milestoneService.createMilestone(milestoneData);

        return reply.code(201).send({ milestone });
    }

    public async getAllProjectMilestones(
        request: FastifyRequest<{ Params: { projectId: string } }>,
        reply: FastifyReply,
    ) {
        const milestones = await this.milestoneService.getProjectMilestones(
            request.params.projectId,
        );
        return reply.send({ milestones });
    }

    public async getMilestone(
        request: FastifyRequest<{ Params: { milestoneId: string } }>,
        reply: FastifyReply,
    ) {
        const milestone = await this.milestoneService.getMilestoneById(
            request.params.milestoneId,
        );

        if (!milestone) {
            return reply.notFound("Milestone not found");
        }

        return reply.send({ milestone });
    }

    public async updateMilestone(
        request: FastifyRequest<{
            Params: { milestoneId: string };
            Body: UpdateMilestone;
        }>,
        reply: FastifyReply,
    ) {
        const milestonePayload: Partial<DbNewMilestone> = {
            title: request.body.title,
            description: request.body.description,
            status: request.body.status,
        };

        if (request.body.startDate !== undefined) {
            milestonePayload.startDate = request.body.startDate
                ? new Date(request.body.startDate)
                : null;
        }

        if (request.body.endDate !== undefined) {
            milestonePayload.endDate = request.body.endDate
                ? new Date(request.body.endDate)
                : null;
        }

        const milestone = await this.milestoneService.updateMilestone(
            request.params.milestoneId,
            milestonePayload,
        );

        if (!milestone) {
            return reply.notFound("Milestone not found");
        }

        return reply.send({ milestone });
    }

    public async deleteMilestone(
        request: FastifyRequest<{ Params: { milestoneId: string } }>,
        reply: FastifyReply,
    ) {
        const milestone = await this.milestoneService.deleteMilestone(
            request.params.milestoneId,
        );

        if (!milestone) {
            return reply.notFound("Milestone not found");
        }

        return reply.send({ milestone });
    }
}
