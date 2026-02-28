import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { projectDefinedRolesModel } from "./project-defined-roles.model";
import { projectModel } from "./project.model";
import { usersModel } from "./user.model";

export const projectRolesModel = pgTable(
    "project_roles",
    {
        projectId: uuid("project_id")
            .notNull()
            .references(() => projectModel.id),
        userId: uuid("user_id")
            .notNull()
            .references(() => usersModel.id),
        roleId: uuid("role_id")
            .notNull()
            .references(() => projectDefinedRolesModel.id),
    },
    (table) => ({
        primary: primaryKey(table.projectId, table.userId, table.roleId),
        userIdIdx: index("project_roles_user_id_idx").on(table.userId),
    }),
);

export type DbProjectRole = typeof projectRolesModel.$inferSelect;
export type DbNewProjectRole = typeof projectRolesModel.$inferInsert;
export type DbProjectUserRoleRow = {
    userId: string;
    discordId: string;
    fullName: string | null;
    nickName: string | null;
    avatar: string | null;
    email: string | null;
    roleId: string;
    roleName: string;
    permissionCode: string;
};

/* eslint-disable @typescript-eslint/no-extraneous-class -- This is a DAL class */
import { and, eq } from "drizzle-orm";
import { db } from "../index";

export class ProjectRolesDal {
    static async assignRole(input: DbNewProjectRole): Promise<DbProjectRole> {
        const [role] = await db
            .insert(projectRolesModel)
            .values(input)
            .returning();

        return role;
    }

    static async getUserRoles(userId: string): Promise<DbProjectRole[]> {
        return await db
            .select()
            .from(projectRolesModel)
            .where(eq(projectRolesModel.userId, userId));
    }

    static async getProjectRoles(projectId: string): Promise<DbProjectRole[]> {
        return await db
            .select()
            .from(projectRolesModel)
            .where(eq(projectRolesModel.projectId, projectId));
    }

    static async getUserRolesByProjectId(
        projectId: string,
        userId: string,
    ): Promise<DbProjectRole[]> {
        return await db
            .select()
            .from(projectRolesModel)
            .where(
                and(
                    eq(projectRolesModel.projectId, projectId),
                    eq(projectRolesModel.userId, userId),
                ),
            );
    }

    static async getProjectUsersWithRoles(
        projectId: string,
    ): Promise<DbProjectUserRoleRow[]> {
        return await db
            .select({
                userId: usersModel.id,
                discordId: usersModel.discordId,
                fullName: usersModel.fullName,
                nickName: usersModel.nickName,
                avatar: usersModel.avatar,
                email: usersModel.email,
                roleId: projectDefinedRolesModel.id,
                roleName: projectDefinedRolesModel.roleName,
                permissionCode: projectDefinedRolesModel.permissionCode,
            })
            .from(projectRolesModel)
            .innerJoin(usersModel, eq(projectRolesModel.userId, usersModel.id))
            .innerJoin(
                projectDefinedRolesModel,
                eq(projectRolesModel.roleId, projectDefinedRolesModel.id),
            )
            .where(eq(projectRolesModel.projectId, projectId));
    }

    static async removeRole(
        projectId: string,
        userId: string,
        roleId: string,
    ): Promise<DbProjectRole> {
        const [removedRole] = await db
            .delete(projectRolesModel)
            .where(
                and(
                    eq(projectRolesModel.projectId, projectId),
                    eq(projectRolesModel.userId, userId),
                    eq(projectRolesModel.roleId, roleId),
                ),
            )
            .returning();

        return removedRole;
    }
}
