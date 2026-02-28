import milestoneModule from "@/modules/milestone";
import MilestoneService from "@/modules/milestone/milestone.service";
import { fastifySensible } from "@fastify/sensible";
import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("MilestoneRoute", () => {
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
                };
            },
        );

        await app.register(fastifySensible);
        await app.register(milestoneModule, {
            prefix: "/api/edge/projects/:projectId/milestones",
        });
        await app.ready();
    });

    afterEach(async () => {
        await app.close();
    });

    it("creates milestone", async () => {
        const milestone = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "M1",
            description: "Initial milestone",
            status: "pending",
            startDate: new Date("2026-01-01T00:00:00.000Z"),
            endDate: new Date("2026-01-31T00:00:00.000Z"),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        vi.spyOn(
            MilestoneService.prototype,
            "createMilestone",
        ).mockResolvedValue(milestone as never);

        const response = await app.inject({
            method: "POST",
            url: "/api/edge/projects/0194f7ca-f67f-7a60-9a48-2412f9f2fdc7/milestones",
            payload: {
                title: "M1",
                description: "Initial milestone",
                status: "pending",
                startDate: "2026-01-01T00:00:00.000Z",
                endDate: "2026-01-31T00:00:00.000Z",
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toHaveProperty("milestone");
    });

    it("gets all project milestones", async () => {
        const milestones = [
            {
                id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
                projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
                title: "M1",
                description: "Initial milestone",
                status: "pending",
                startDate: new Date("2026-01-01T00:00:00.000Z"),
                endDate: new Date("2026-01-31T00:00:00.000Z"),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        vi.spyOn(
            MilestoneService.prototype,
            "getProjectMilestones",
        ).mockResolvedValue(milestones as never);

        const response = await app.inject({
            method: "GET",
            url: "/api/edge/projects/0194f7ca-f67f-7a60-9a48-2412f9f2fdc7/milestones",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toHaveProperty("milestones");
        expect(response.json().milestones).toHaveLength(1);
    });

    it("updates a milestone", async () => {
        const milestone = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "M1 Updated",
            description: "Updated milestone",
            status: "in_progress",
            startDate: new Date("2026-01-01T00:00:00.000Z"),
            endDate: new Date("2026-02-01T00:00:00.000Z"),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        vi.spyOn(
            MilestoneService.prototype,
            "updateMilestone",
        ).mockResolvedValue(milestone as never);

        const response = await app.inject({
            method: "PUT",
            url: "/api/edge/projects/0194f7ca-f67f-7a60-9a48-2412f9f2fdc7/milestones/0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            payload: {
                title: "M1 Updated",
                status: "in_progress",
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toHaveProperty("milestone");
    });

    it("deletes a milestone", async () => {
        const milestone = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "M1",
            description: "Initial milestone",
            status: "pending",
            startDate: new Date("2026-01-01T00:00:00.000Z"),
            endDate: new Date("2026-01-31T00:00:00.000Z"),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        vi.spyOn(
            MilestoneService.prototype,
            "deleteMilestone",
        ).mockResolvedValue(milestone as never);

        const response = await app.inject({
            method: "DELETE",
            url: "/api/edge/projects/0194f7ca-f67f-7a60-9a48-2412f9f2fdc7/milestones/0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toHaveProperty("milestone");
    });
});
