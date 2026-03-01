import {
    ADMIN_MEMBER_PERMISSIONS,
    DEFAULT_MEMBER_PERMISSIONS,
    PERMISSION_BIT_FLAGS,
} from "@/utils/constants";

import GlobalUtils from "@/utils/golabalUtils";
import {
    LabelDal,
    ProjectDal,
    ProjectDefinedRolesDal,
    ProjectInvitesDal,
    ProjectRolesDal,
    ServerDal,
    TaskTypeDal,
    UserDal,
    type DbNewProject,
    type DbProject,
    type DbProjectInvite,
} from "@taskcord/database";
import crypto from "node:crypto";
import type { CreateProjectInvite } from "./project.schema";

const PROJECT_DEFAULT_ROLES = [
    {
        roleName: "Owner",
        description: "Full control over project settings, members, and data.",
        permissionCode: String(
            PERMISSION_BIT_FLAGS.OWNER |
                ADMIN_MEMBER_PERMISSIONS |
                PERMISSION_BIT_FLAGS.DELETE_PROJECT,
        ),
    },
    {
        roleName: "Admin",
        description:
            "Manage most project operations, members, tasks, and boards.",
        permissionCode: String(ADMIN_MEMBER_PERMISSIONS),
    },
    {
        roleName: "Contributor",
        description:
            "Create and manage day-to-day work without member admin rights.",
        permissionCode: String(
            DEFAULT_MEMBER_PERMISSIONS |
                PERMISSION_BIT_FLAGS.MANAGE_TASK |
                PERMISSION_BIT_FLAGS.MANAGE_BOARDS |
                PERMISSION_BIT_FLAGS.MANAGE_STATUSES,
        ),
    },
    {
        roleName: "Viewer",
        description: "Read-only access to project resources.",
        permissionCode: String(DEFAULT_MEMBER_PERMISSIONS),
    },
] as const;

const PROJECT_DEFAULT_LEVELS = [
    {
        label: "Backlog",
        description: "Planned work that has not been scheduled yet.",
        color: "#1f2937,#f9fafb",
        order: 1,
    },
    {
        label: "Todo",
        description: "Work that is ready to be started.",
        color: "#334155,#f8fafc",
        order: 2,
    },
    {
        label: "In Progress",
        description: "Work currently being executed.",
        color: "#1d4ed8,#dbeafe",
        order: 3,
    },
    {
        label: "Review",
        description: "Work waiting for review or approval.",
        color: "#7c3aed,#ede9fe",
        order: 4,
    },
    {
        label: "Done",
        description: "Completed and accepted work.",
        color: "#065f46,#d1fae5",
        order: 5,
    },
] as const;

const PROJECT_DEFAULT_TASK_TYPES = {
    general: [
        {
            name: "Task",
            description: "General work item to track project work.",
            order: 1,
        },
        {
            name: "Feature",
            description: "New capability to be built and released.",
            order: 2,
        },
        {
            name: "Bug",
            description: "Defect or unexpected behavior to fix.",
            order: 3,
        },
    ],
    software: [
        {
            name: "Bug",
            description: "Defect or unexpected behavior to fix.",
            order: 1,
        },
        {
            name: "Feature",
            description: "New capability to be implemented.",
            order: 2,
        },
        {
            name: "Task",
            description: "Engineering task for maintenance or delivery.",
            order: 3,
        },
    ],
    marketing: [
        {
            name: "Campaign",
            description: "Marketing campaign planning and execution.",
            order: 1,
        },
        {
            name: "Content",
            description: "Content creation, review, and publishing.",
            order: 2,
        },
        {
            name: "Task",
            description: "General marketing execution work.",
            order: 3,
        },
    ],
    design: [
        {
            name: "Feature",
            description: "Design initiative for a product feature.",
            order: 1,
        },
        {
            name: "Bug",
            description: "UX/UI issue to resolve.",
            order: 2,
        },
        {
            name: "Task",
            description: "General design task and follow-up work.",
            order: 3,
        },
    ],
} as const;

export default class ProjectService {
    private static readonly DEFAULT_INVITE_EXPIRY_HOURS = 24 * 7;

    private static readonly DEFAULT_MULTI_USE_MAX = 25;

    private static readonly ALLOWED_RESTRICTION_TYPES = [
        "none",
        "email",
        "discord_id",
    ] as const;

    private sanitizeInvite(invite: DbProjectInvite) {
        return {
            id: invite.id,
            projectId: invite.projectId,
            inviterId: invite.inviterId,
            roleId: invite.roleId,
            inviteType: invite.inviteType,
            restrictionType: invite.restrictionType,
            restrictedEmail: invite.restrictedEmail,
            restrictedDiscordId: invite.restrictedDiscordId,
            maxUses: invite.maxUses,
            usedCount: invite.usedCount,
            expiresAt: invite.expiresAt,
            revokedAt: invite.revokedAt,
            lastAcceptedAt: invite.lastAcceptedAt,
            createdAt: invite.createdAt,
            updatedAt: invite.updatedAt,
        };
    }

    private async assertProjectOwner(
        projectId: string,
        requesterUserId: string,
    ) {
        const project = await ProjectDal.getProjectById(projectId);

        if (!project) {
            throw new Error("Project not found");
        }

        if (project.creatorId !== requesterUserId) {
            throw new Error("Only project owner can manage invitations");
        }

        return project;
    }

    public async createProject(
        userDiscordId: string,
        projectData: DbNewProject,
    ): Promise<DbProject> {
        // Get the user's UUID from their Discord ID
        const user = await UserDal.getUserByDiscordId(userDiscordId);
        if (!user) {
            throw new Error("User not found");
        }

        // Create the project with the user as creator
        const projectType = projectData.projectType ?? "general";
        const project = await ProjectDal.createProject({
            title: projectData.title,
            description: projectData.description,
            managerId: projectData.managerId,
            discordServerId: projectData.discordServerId,
            projectType,
            creatorId: user.id,
        });

        const createdRoles = await Promise.all(
            PROJECT_DEFAULT_ROLES.map((role) =>
                ProjectDefinedRolesDal.createRole({
                    projectId: project.id,
                    creatorId: user.id,
                    roleName: role.roleName,
                    description: role.description,
                    permissionCode: role.permissionCode,
                }),
            ),
        );

        const ownerRole = createdRoles.find(
            (role) => role.roleName === "Owner",
        );

        if (ownerRole) {
            await ProjectRolesDal.assignRole({
                projectId: project.id,
                userId: user.id,
                roleId: ownerRole.id,
            });
        }

        await Promise.all(
            PROJECT_DEFAULT_LEVELS.map((level) =>
                LabelDal.createLabel({
                    projectId: project.id,
                    creatorId: user.id,
                    label: level.label,
                    description: level.description,
                    color: level.color,
                    isStatus: true,
                    order: level.order,
                }),
            ),
        );

        const taskTypes =
            PROJECT_DEFAULT_TASK_TYPES[
                projectType as keyof typeof PROJECT_DEFAULT_TASK_TYPES
            ] ?? PROJECT_DEFAULT_TASK_TYPES.general;

        await Promise.all(
            taskTypes.map((taskType) =>
                TaskTypeDal.createTaskType({
                    projectId: project.id,
                    creatorId: user.id,
                    name: taskType.name,
                    description: taskType.description,
                    order: taskType.order,
                }),
            ),
        );

        return project;
    }

    public async getProject(id: string): Promise<DbProject | null> {
        return ProjectDal.getProjectById(id);
    }

    public async getAllProjects(creatorId: string): Promise<DbProject[]> {
        return ProjectDal.getProjectsByCreatorId(creatorId);
    }

    public async getUserProjects(userDiscordId: string): Promise<DbProject[]> {
        // Get the user's UUID from their Discord ID
        const user = await UserDal.getUserByDiscordId(userDiscordId);
        if (!user) {
            throw new Error("User not found");
        }

        // Get projects where the user is the creator
        return ProjectDal.getProjectsByCreatorId(user.id);
    }

    public async getProjectsByManager(managerId: string): Promise<DbProject[]> {
        return ProjectDal.getProjectsByManagerId(managerId);
    }

    public async updateProject(
        id: string,
        projectData: Partial<DbNewProject>,
    ): Promise<DbProject | null> {
        // Convert date strings to Date objects if they exist
        const processedData: Partial<DbNewProject> = {
            ...projectData,
        };

        if (projectData.startingTimestamp) {
            processedData.startingTimestamp = new Date(
                projectData.startingTimestamp,
            );
        }

        if (projectData.estimatedCompletionTimestamp) {
            processedData.estimatedCompletionTimestamp = new Date(
                projectData.estimatedCompletionTimestamp,
            );
        }

        try {
            return await ProjectDal.updateProject(id, processedData);
        } catch (error) {
            console.error("Error updating project:", error);
            return null;
        }
    }

    public async deleteProject(id: string): Promise<DbProject | null> {
        try {
            return await ProjectDal.deleteProject(id);
        } catch (error) {
            console.error("Error deleting project:", error);
            return null;
        }
    }

    public async isBotInServer(serverId: string): Promise<boolean> {
        const server = await ServerDal.getServerById(serverId);
        return server !== null && Boolean(server.ownerId);
    }

    public async createProjectInvite(input: {
        projectId: string;
        inviterUserId: string;
        payload: CreateProjectInvite;
    }) {
        await this.assertProjectOwner(input.projectId, input.inviterUserId);

        if (
            !ProjectService.ALLOWED_RESTRICTION_TYPES.includes(
                input.payload.restrictionType,
            )
        ) {
            throw new Error("Invalid restriction type");
        }

        if (
            input.payload.restrictionType === "email" &&
            !input.payload.restrictedEmail
        ) {
            throw new Error(
                "restrictedEmail is required for email restriction",
            );
        }

        if (
            input.payload.restrictionType === "discord_id" &&
            !input.payload.restrictedDiscordId
        ) {
            throw new Error(
                "restrictedDiscordId is required for discord_id restriction",
            );
        }

        if (input.payload.roleId) {
            const role = await ProjectDefinedRolesDal.getRoleById(
                input.payload.roleId,
            );
            if (!role || role.projectId !== input.projectId) {
                throw new Error("Invalid roleId for this project");
            }
        }

        const inviteToken = crypto.randomBytes(32).toString("base64url");
        const tokenHash = crypto
            .createHash("sha256")
            .update(inviteToken)
            .digest("hex");

        const inviteType = input.payload.inviteType ?? "single_use";
        const maxUses =
            inviteType === "multi_use"
                ? (input.payload.maxUses ??
                  ProjectService.DEFAULT_MULTI_USE_MAX)
                : 1;

        const expiresInHours =
            input.payload.expiresInHours ??
            ProjectService.DEFAULT_INVITE_EXPIRY_HOURS;

        const expiresAt = new Date(
            Date.now() + expiresInHours * 60 * 60 * 1000,
        );

        const invite = await ProjectInvitesDal.createInvite({
            projectId: input.projectId,
            inviterId: input.inviterUserId,
            roleId: input.payload.roleId,
            tokenHash,
            inviteType,
            restrictionType: input.payload.restrictionType,
            restrictedEmail:
                input.payload.restrictionType === "email"
                    ? input.payload.restrictedEmail?.toLowerCase()
                    : null,
            restrictedDiscordId:
                input.payload.restrictionType === "discord_id"
                    ? input.payload.restrictedDiscordId
                    : null,
            maxUses,
            usedCount: 0,
            expiresAt,
        });

        const apiHostUrl = GlobalUtils.getApiHostUrl();
        const authInitUrl = `${apiHostUrl}/api/edge/auth/discord/init?invite_token=${encodeURIComponent(inviteToken)}`;

        return {
            invite: this.sanitizeInvite(invite),
            inviteToken,
            authInitUrl,
        };
    }

    public async listProjectInvites(
        projectId: string,
        requesterUserId: string,
    ) {
        await this.assertProjectOwner(projectId, requesterUserId);

        const invites = await ProjectInvitesDal.listInvitesByProject(projectId);

        return invites.map((invite) => this.sanitizeInvite(invite));
    }

    public async revokeProjectInvite(
        projectId: string,
        inviteId: string,
        requesterUserId: string,
    ) {
        await this.assertProjectOwner(projectId, requesterUserId);

        const invite = await ProjectInvitesDal.getInviteById(inviteId);

        if (!invite || invite.projectId !== projectId) {
            return null;
        }

        const revokedInvite = await ProjectInvitesDal.revokeInvite(inviteId);

        if (!revokedInvite) {
            return null;
        }

        return this.sanitizeInvite(revokedInvite);
    }

    public async listProjectDefinedRoles(
        projectId: string,
        requesterUserId: string,
    ) {
        await this.assertProjectOwner(projectId, requesterUserId);

        return await ProjectDefinedRolesDal.getRolesByProjectId(projectId);
    }
}
