import type { FastifyInstance } from "fastify";
import LabelController from "./label.controller";
import type { CreateLabel, UpdateLabel } from "./label.schema";
import LabelService from "./label.service";

export default function LabelsRoute(fastify: FastifyInstance) {
    const labelController = new LabelController(new LabelService());

    // Create a new task label
    fastify.post<{ Body: CreateLabel; Params: { projectId: string } }>(
        "/",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Labels"],
                description: "Create a new task label",
                body: { $ref: "createLabelSchema" },
                response: {
                    201: { $ref: "labelResponse" },
                    400: { $ref: "labelErrorResponse" },
                },
            },
        },
        labelController.createLabel.bind(labelController),
    );

    // Get all task labels of a project
    fastify.get<{ Params: { projectId: string } }>(
        "/",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Labels"],
                description: "Get all task labels of a project",
                params: {
                    type: "object",
                    properties: {
                        projectId: { type: "string" },
                    },
                    required: ["projectId"],
                },
                response: {
                    200: { $ref: "labelsResponse" },
                },
            },
        },
        labelController.getAllProjectLabels.bind(labelController),
    );

    // Update a task label
    fastify.put<{ Params: { labelId: string }; Body: UpdateLabel }>(
        "/:labelId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Labels"],
                description: "Update a task label",
                body: { $ref: "updateLabelSchema" },
                response: {
                    200: { $ref: "labelResponse" },
                    400: { $ref: "labelErrorResponse" },
                },
            },
        },
        labelController.updateLabel.bind(labelController),
    );

    // Delete a task label
    fastify.delete<{ Params: { labelId: string } }>(
        "/:labelId",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Labels"],
                description: "Delete a task label",
                params: {
                    type: "object",
                    properties: {
                        labelId: { type: "string" },
                    },
                    required: ["labelId"],
                },
                response: {
                    200: { $ref: "labelResponse" },
                    400: { $ref: "labelErrorResponse" },
                },
            },
        },
        labelController.deleteLabel.bind(labelController),
    );

    // Delete multiple task labels
    fastify.delete<{ Body: { ids: string[] } }>(
        "/bulk",
        {
            onRequest: [fastify.jwtAuth],
            schema: {
                tags: ["Task Labels"],
                description: "Delete multiple task labels",
                body: {
                    type: "object",
                    properties: {
                        ids: { type: "array", items: { type: "string" } },
                    },
                },
            },
        },
        labelController.deleteLabelBulk.bind(labelController),
    );
}
