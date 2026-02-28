import { eq } from "drizzle-orm";
import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { db } from "..";
import { projectModel } from "./project.model";
import { usersModel } from "./user.model";

export const projectDefinedRolesModel = pgTable(
    "project_defined_roles",
    {
        id: uuid("id")
            .primaryKey()
            .notNull()
            .$defaultFn(() => uuidv7()),
        projectId: uuid("project_id")
            .notNull()
            .references(() => projectModel.id, { onDelete: "cascade" }),
        roleName: varchar("role_name").notNull(),
        description: varchar("description", { length: 255 }),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
        permissionCode: varchar("permission_code", { length: 255 }).notNull(),
        creatorId: uuid("creator_id")
            .notNull()
            .references(() => usersModel.id, { onDelete: "cascade" }),
    },
    (table) => ({
        projectIdIdx: index("project_defined_roles_project_id_idx").on(
            table.projectId,
        ),
    }),
);

export type DbProjectDefinedRole = typeof projectDefinedRolesModel.$inferSelect;
export type DbNewProjectDefinedRole =
    typeof projectDefinedRolesModel.$inferInsert;

export class ProjectDefinedRolesDal {
    static async createRole(
        input: DbNewProjectDefinedRole,
    ): Promise<DbProjectDefinedRole> {
        const [role] = await db
            .insert(projectDefinedRolesModel)
            .values(input)
            .returning();

        return role;
    }

    static async getRoleById(id: string): Promise<DbProjectDefinedRole | null> {
        const result = await db
            .select()
            .from(projectDefinedRolesModel)
            .where(eq(projectDefinedRolesModel.id, id))
            .limit(1);

        return result.at(0) ?? null;
    }

    static async getRolesByProjectId(
        projectId: string,
    ): Promise<DbProjectDefinedRole[]> {
        return await db
            .select()
            .from(projectDefinedRolesModel)
            .where(eq(projectDefinedRolesModel.projectId, projectId));
    }

    static async updateRole(
        id: string,
        data: Partial<DbNewProjectDefinedRole>,
    ): Promise<DbProjectDefinedRole> {
        const [updatedRole] = await db
            .update(projectDefinedRolesModel)
            .set(data)
            .where(eq(projectDefinedRolesModel.id, id))
            .returning();

        return updatedRole;
    }

    static async deleteRole(id: string): Promise<DbProjectDefinedRole> {
        const [deletedRole] = await db
            .delete(projectDefinedRolesModel)
            .where(eq(projectDefinedRolesModel.id, id))
            .returning();

        return deletedRole;
    }
}
