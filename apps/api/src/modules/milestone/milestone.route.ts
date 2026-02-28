import type { FastifyInstance } from "fastify";
import MilestoneController from "./milestone.controller";
import type { CreateMilestone, UpdateMilestone } from "./milestone.schema";
import MilestoneService from "./milestone.service";

export default function MilestoneRoute(fastify: FastifyInstance) {
    const milestoneController = new MilestoneController(new MilestoneService());

    fastify.post<{ Body: CreateMilestone; Params: { projectId: string } }>(
        "/",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Milestones"],
                description: "Create a new milestone",
                body: { $ref: "createMilestoneSchema" },
                response: {
                    201: { $ref: "milestoneResponse" },
                    400: { $ref: "milestoneErrorResponse" },
                },
            },
        },
        milestoneController.createMilestone.bind(milestoneController),
    );

    fastify.get<{ Params: { projectId: string } }>(
        "/",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Milestones"],
                description: "Get all milestones of a project",
                params: {
                    type: "object",
                    properties: {
                        projectId: { type: "string" },
                    },
                    required: ["projectId"],
                },
                response: {
                    200: { $ref: "milestonesResponse" },
                },
            },
        },
        milestoneController.getAllProjectMilestones.bind(milestoneController),
    );

    fastify.get<{ Params: { milestoneId: string } }>(
        "/:milestoneId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Milestones"],
                description: "Get a milestone by id",
                params: { $ref: "milestoneSchemaWithId" },
                response: {
                    200: { $ref: "milestoneResponse" },
                    404: { $ref: "milestoneErrorResponse" },
                },
            },
        },
        milestoneController.getMilestone.bind(milestoneController),
    );

    fastify.put<{ Params: { milestoneId: string }; Body: UpdateMilestone }>(
        "/:milestoneId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Milestones"],
                description: "Update a milestone",
                params: { $ref: "milestoneSchemaWithId" },
                body: { $ref: "updateMilestoneSchema" },
                response: {
                    200: { $ref: "milestoneResponse" },
                    404: { $ref: "milestoneErrorResponse" },
                },
            },
        },
        milestoneController.updateMilestone.bind(milestoneController),
    );

    fastify.delete<{ Params: { milestoneId: string } }>(
        "/:milestoneId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Milestones"],
                description: "Delete a milestone",
                params: { $ref: "milestoneSchemaWithId" },
                response: {
                    200: { $ref: "milestoneResponse" },
                    404: { $ref: "milestoneErrorResponse" },
                },
            },
        },
        milestoneController.deleteMilestone.bind(milestoneController),
    );
}
