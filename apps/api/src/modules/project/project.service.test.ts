import ProjectService from "@/modules/project/project.service";
import GlobalUtils from "@/utils/golabalUtils";
import {
    LabelDal,
    ProjectDal,
    ProjectDefinedRolesDal,
    ProjectInvitesDal,
    ProjectRolesDal,
    TaskTypeDal,
    UserDal,
} from "@taskcord/database";
import crypto from "node:crypto";
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

describe("ProjectService.createProjectInvite", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("creates a multi-use invite with auth init url", async () => {
        vi.spyOn(ProjectDal, "getProjectById").mockResolvedValue({
            id: "project-1",
            title: "Roadmap",
            description: "Q1 work",
            creatorId: "owner-1",
            managerId: "discord-123",
            discordServerId: "server-123",
            projectType: "software",
            status: "",
            createdAt: new Date(),
            logo: "",
            startingTimestamp: null,
            estimatedCompletionTimestamp: null,
            completedAt: null,
        } as never);

        vi.spyOn(ProjectDefinedRolesDal, "getRoleById").mockResolvedValue({
            id: "role-1",
            projectId: "project-1",
            roleName: "Member",
            description: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            permissionCode: "1",
            creatorId: "owner-1",
        } as never);

        vi.spyOn(GlobalUtils, "getApiHostUrl").mockReturnValue(
            "http://localhost:5001",
        );

        vi.spyOn(crypto, "randomBytes").mockImplementation(
            (() => Buffer.from("deterministic-token-1234567890")) as never,
        );

        const createInviteSpy = vi
            .spyOn(ProjectInvitesDal, "createInvite")
            .mockImplementation(async (input) => {
                return {
                    id: "invite-1",
                    ...input,
                    revokedAt: null,
                    lastAcceptedAt: null,
                    lastAcceptedBy: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as never;
            });

        const service = new ProjectService();
        const result = await service.createProjectInvite({
            projectId: "project-1",
            inviterUserId: "owner-1",
            payload: {
                roleId: "role-1",
                inviteType: "multi_use",
                maxUses: 20,
                restrictionType: "none",
                expiresInHours: 12,
            },
        });

        expect(createInviteSpy).toHaveBeenCalledTimes(1);
        expect(result.invite.projectId).toBe("project-1");
        expect(result.invite.maxUses).toBe(20);
        expect(result.authInitUrl).toContain(
            "http://localhost:5001/api/edge/auth/discord/init?invite_token=",
        );
        expect(result.inviteToken.length).toBeGreaterThan(8);
    });

    it("throws when requester is not project owner", async () => {
        vi.spyOn(ProjectDal, "getProjectById").mockResolvedValue({
            id: "project-1",
            title: "Roadmap",
            description: "Q1 work",
            creatorId: "owner-1",
            managerId: "discord-123",
            discordServerId: "server-123",
            projectType: "software",
            status: "",
            createdAt: new Date(),
            logo: "",
            startingTimestamp: null,
            estimatedCompletionTimestamp: null,
            completedAt: null,
        } as never);

        const service = new ProjectService();

        await expect(
            service.createProjectInvite({
                projectId: "project-1",
                inviterUserId: "not-owner",
                payload: {
                    inviteType: "single_use",
                    restrictionType: "none",
                },
            }),
        ).rejects.toThrow("Only project owner can manage invitations");
    });
});
