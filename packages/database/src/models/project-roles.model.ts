import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { projectModel } from "./project.model";
import { usersModel } from "./user.model";
import { projectDefinedRolesModel } from "./project-defined-roles.model";

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
  }),
);

export type DbProjectRole = typeof projectRolesModel.$inferSelect;
export type DbNewProjectRole = typeof projectRolesModel.$inferInsert;

/* eslint-disable @typescript-eslint/no-extraneous-class -- This is a DAL class */
import { and, eq } from "drizzle-orm";
import { db } from "../index";

export class ProjectRolesDal {
  static async assignRole(input: DbNewProjectRole): Promise<DbProjectRole> {
    const [role] = await db.insert(projectRolesModel).values(input).returning();

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
