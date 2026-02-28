import AuthService from "@/modules/auth/auth.service";
import {
    ProjectDefinedRolesDal,
    ProjectInvitesDal,
    ProjectRolesDal,
} from "@taskcord/database";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("AuthService.acceptProjectInviteToken", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("assigns role and marks invite consumed when invite is valid", async () => {
        const invite = {
            id: "invite-1",
            projectId: "project-1",
            inviterId: "user-owner",
            roleId: "role-member",
            tokenHash: "hash",
            inviteType: "single_use",
            restrictionType: "none",
            restrictedEmail: null,
            restrictedDiscordId: null,
            maxUses: 1,
            usedCount: 0,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
            revokedAt: null,
            lastAcceptedAt: null,
            lastAcceptedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        vi.spyOn(ProjectInvitesDal, "getInviteByTokenHash").mockResolvedValue(
            invite as never,
        );
        vi.spyOn(ProjectRolesDal, "getUserRolesByProjectId").mockResolvedValue(
            [] as never,
        );
        vi.spyOn(ProjectDefinedRolesDal, "getRoleById").mockResolvedValue({
            id: "role-member",
            projectId: "project-1",
            roleName: "Member",
            description: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            permissionCode: "1",
            creatorId: "owner-id",
        } as never);
        vi.spyOn(ProjectInvitesDal, "consumeInvite").mockResolvedValue({
            ...invite,
            usedCount: 1,
        } as never);
        const assignRoleSpy = vi
            .spyOn(ProjectRolesDal, "assignRole")
            .mockResolvedValue({
                projectId: "project-1",
                userId: "user-1",
                roleId: "role-member",
            } as never);

        const service = new AuthService();
        const result = await service.acceptProjectInviteToken("raw-token", {
            id: "user-1",
            discordId: "discord-1",
            fullName: "Demo",
            nickName: "Demo",
            avatar: "",
            email: "user@example.com",
            discordRefreshToken: "",
            discordAccessToken: "",
            discordAccessTokenExpiresAt: null,
            lastAuth: new Date(),
            isVerified: true,
            updatedAt: new Date(),
            createdAt: new Date(),
        });

        expect(result).toEqual({ status: "joined", projectId: "project-1" });
        expect(assignRoleSpy).toHaveBeenCalledWith({
            projectId: "project-1",
            userId: "user-1",
            roleId: "role-member",
        });
        expect(ProjectInvitesDal.consumeInvite).toHaveBeenCalledTimes(1);
    });

    it("returns restricted when email restriction does not match", async () => {
        vi.spyOn(ProjectInvitesDal, "getInviteByTokenHash").mockResolvedValue({
            id: "invite-2",
            projectId: "project-1",
            inviterId: "user-owner",
            roleId: null,
            tokenHash: "hash",
            inviteType: "single_use",
            restrictionType: "email",
            restrictedEmail: "expected@example.com",
            restrictedDiscordId: null,
            maxUses: 1,
            usedCount: 0,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
            revokedAt: null,
            lastAcceptedAt: null,
            lastAcceptedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as never);
        const consumeInviteSpy = vi.spyOn(ProjectInvitesDal, "consumeInvite");

        const service = new AuthService();
        const result = await service.acceptProjectInviteToken("raw-token", {
            id: "user-1",
            discordId: "discord-1",
            fullName: "Demo",
            nickName: "Demo",
            avatar: "",
            email: "different@example.com",
            discordRefreshToken: "",
            discordAccessToken: "",
            discordAccessTokenExpiresAt: null,
            lastAuth: new Date(),
            isVerified: true,
            updatedAt: new Date(),
            createdAt: new Date(),
        });

        expect(result).toEqual({ status: "restricted", projectId: "project-1" });
        expect(consumeInviteSpy).not.toHaveBeenCalled();
    });

    it("returns already_member when user already has a role in project", async () => {
        vi.spyOn(ProjectInvitesDal, "getInviteByTokenHash").mockResolvedValue({
            id: "invite-3",
            projectId: "project-2",
            inviterId: "user-owner",
            roleId: null,
            tokenHash: "hash",
            inviteType: "multi_use",
            restrictionType: "none",
            restrictedEmail: null,
            restrictedDiscordId: null,
            maxUses: 2,
            usedCount: 0,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
            revokedAt: null,
            lastAcceptedAt: null,
            lastAcceptedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as never);
        vi.spyOn(ProjectRolesDal, "getUserRolesByProjectId").mockResolvedValue([
            {
                projectId: "project-2",
                userId: "user-2",
                roleId: "role-viewer",
            },
        ] as never);
        const consumeInviteSpy = vi.spyOn(ProjectInvitesDal, "consumeInvite");

        const service = new AuthService();
        const result = await service.acceptProjectInviteToken("raw-token", {
            id: "user-2",
            discordId: "discord-2",
            fullName: "Demo 2",
            nickName: "Demo 2",
            avatar: "",
            email: "user2@example.com",
            discordRefreshToken: "",
            discordAccessToken: "",
            discordAccessTokenExpiresAt: null,
            lastAuth: new Date(),
            isVerified: true,
            updatedAt: new Date(),
            createdAt: new Date(),
        });

        expect(result).toEqual({ status: "already_member", projectId: "project-2" });
        expect(consumeInviteSpy).not.toHaveBeenCalled();
    });
});
