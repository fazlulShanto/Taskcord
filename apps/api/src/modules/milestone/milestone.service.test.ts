import MilestoneService from "@/modules/milestone/milestone.service";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockMilestoneDal } = vi.hoisted(() => ({
    mockMilestoneDal: {
        createMilestone: vi.fn(),
        getProjectMilestones: vi.fn(),
        updateMilestone: vi.fn(),
        deleteMilestone: vi.fn(),
    },
}));

vi.mock("@taskcord/database", async () => {
    const actual = await vi.importActual<object>("@taskcord/database");
    return {
        ...actual,
        MilestoneDal: mockMilestoneDal,
    };
});

describe("MilestoneService CRUD", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        mockMilestoneDal.createMilestone.mockReset();
        mockMilestoneDal.getProjectMilestones.mockReset();
        mockMilestoneDal.updateMilestone.mockReset();
        mockMilestoneDal.deleteMilestone.mockReset();
    });

    it("creates milestone", async () => {
        const milestone = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "M1",
            description: "Initial milestone",
            status: "pending",
            startDate: new Date(),
            endDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockMilestoneDal.createMilestone.mockResolvedValue(milestone as never);

        const service = new MilestoneService();
        const result = await service.createMilestone(milestone as never);

        expect(mockMilestoneDal.createMilestone).toHaveBeenCalledWith(
            milestone,
        );
        expect(result).toEqual(milestone);
    });

    it("reads milestones by project", async () => {
        const milestones = [
            {
                id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
                projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
                title: "M1",
                description: "Initial milestone",
                status: "pending",
                startDate: new Date(),
                endDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        mockMilestoneDal.getProjectMilestones.mockResolvedValue(
            milestones as never,
        );

        const service = new MilestoneService();
        const result = await service.getProjectMilestones(
            "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
        );

        expect(mockMilestoneDal.getProjectMilestones).toHaveBeenCalledWith(
            "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
        );
        expect(result).toEqual(milestones);
    });

    it("updates milestone", async () => {
        const updated = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "M1 updated",
            description: "Updated description",
            status: "in_progress",
            startDate: new Date(),
            endDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockMilestoneDal.updateMilestone.mockResolvedValue(updated as never);

        const service = new MilestoneService();
        const result = await service.updateMilestone(updated.id, {
            title: "M1 updated",
            status: "in_progress",
        });

        expect(mockMilestoneDal.updateMilestone).toHaveBeenCalledWith(
            updated.id,
            {
                title: "M1 updated",
                status: "in_progress",
            },
        );
        expect(result).toEqual(updated);
    });

    it("deletes milestone", async () => {
        const deleted = {
            id: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc8",
            projectId: "0194f7ca-f67f-7a60-9a48-2412f9f2fdc7",
            title: "M1",
            description: "Initial milestone",
            status: "pending",
            startDate: new Date(),
            endDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockMilestoneDal.deleteMilestone.mockResolvedValue(deleted as never);

        const service = new MilestoneService();
        const result = await service.deleteMilestone(deleted.id);

        expect(mockMilestoneDal.deleteMilestone).toHaveBeenCalledWith(
            deleted.id,
        );
        expect(result).toEqual(deleted);
    });
});
