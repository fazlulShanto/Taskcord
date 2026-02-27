import ProjectService from "@/modules/project/project.service";
import {
    LabelDal,
    ProjectDal,
    ProjectDefinedRolesDal,
    ProjectRolesDal,
    TaskTypeDal,
    UserDal,
} from "@taskcord/database";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("ProjectService.createProject", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("creates project and seeds default roles and levels", async () => {
        const user = { id: "user-uuid" };
        const project = {
            id: "project-uuid",
            title: "Roadmap",
            description: "Q1 work",
            creatorId: user.id,
            managerId: "discord-123",
            discordServerId: "server-123",
            projectType: "software",
            status: "",
            createdAt: new Date(),
            logo: "",
            startingTimestamp: null,
            estimatedCompletionTimestamp: null,
            completedAt: null,
        };

        vi.spyOn(UserDal, "getUserByDiscordId").mockResolvedValue(
            user as never,
        );
        vi.spyOn(ProjectDal, "createProject").mockResolvedValue(
            project as never,
        );

        const createRoleSpy = vi
            .spyOn(ProjectDefinedRolesDal, "createRole")
            .mockImplementation(async (input) => {
                return {
                    ...input,
                    id: `role-${input.roleName}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as never;
            });

        const assignRoleSpy = vi
            .spyOn(ProjectRolesDal, "assignRole")
            .mockResolvedValue({
                projectId: project.id,
                userId: user.id,
                roleId: "role-Owner",
            } as never);

        const createLabelSpy = vi
            .spyOn(LabelDal, "createLabel")
            .mockImplementation(async (input) => {
                return {
                    ...input,
                    id: `label-${input.label}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as never;
            });

        const createTaskTypeSpy = vi
            .spyOn(TaskTypeDal, "createTaskType")
            .mockImplementation(async (input) => {
                return {
                    ...input,
                    id: `task-type-${input.name}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as never;
            });

        const service = new ProjectService();
        const result = await service.createProject("discord-123", {
            title: "Roadmap",
            description: "Q1 work",
            managerId: "discord-123",
            discordServerId: "server-123",
            projectType: "software",
        } as never);

        expect(result).toBe(project);

        expect(ProjectDal.createProject).toHaveBeenCalledWith({
            title: "Roadmap",
            description: "Q1 work",
            managerId: "discord-123",
            discordServerId: "server-123",
            projectType: "software",
            creatorId: user.id,
        });

        expect(createRoleSpy).toHaveBeenCalledTimes(4);
        expect(createRoleSpy.mock.calls.map(([arg]) => arg.roleName)).toEqual([
            "Owner",
            "Admin",
            "Contributor",
            "Viewer",
        ]);

        expect(assignRoleSpy).toHaveBeenCalledWith({
            projectId: project.id,
            userId: user.id,
            roleId: "role-Owner",
        });

        expect(createLabelSpy).toHaveBeenCalledTimes(5);
        expect(createLabelSpy.mock.calls.map(([arg]) => arg.label)).toEqual([
            "Backlog",
            "Todo",
            "In Progress",
            "Review",
            "Done",
        ]);

        expect(
            createLabelSpy.mock.calls.every(
                ([arg]) => arg.projectId === project.id && arg.isStatus,
            ),
        ).toBe(true);

        expect(createTaskTypeSpy).toHaveBeenCalledTimes(3);
        expect(createTaskTypeSpy.mock.calls.map(([arg]) => arg.name)).toEqual([
            "Bug",
            "Feature",
            "Task",
        ]);
    });

    it("throws when user is not found", async () => {
        vi.spyOn(UserDal, "getUserByDiscordId").mockResolvedValue(null);
        const createProjectSpy = vi.spyOn(ProjectDal, "createProject");

        const service = new ProjectService();

        await expect(
            service.createProject("missing-discord-id", {
                title: "Roadmap",
                description: "Q1 work",
                managerId: "discord-123",
                discordServerId: "server-123",
                projectType: "general",
            } as never),
        ).rejects.toThrow("User not found");

        expect(createProjectSpy).not.toHaveBeenCalled();
    });
});
