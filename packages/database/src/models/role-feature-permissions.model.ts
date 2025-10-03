import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { featureModel } from "./feature.model";
import { permissionModel } from "./permission.model";
import { projectDefinedRolesModel } from "./project-defined-roles.model";

export const roleFeaturePermissionsModel = pgTable(
  "role_feature_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => projectDefinedRolesModel.id),
    featureId: uuid("feature_id")
      .notNull()
      .references(() => featureModel.id),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissionModel.id),
  },
  (table) => ({
    primary: primaryKey(table.roleId, table.featureId, table.permissionId),
  }),
);

export type DbRoleFeaturePermission =
  typeof roleFeaturePermissionsModel.$inferSelect;
export type DbNewRoleFeaturePermission =
  typeof roleFeaturePermissionsModel.$inferInsert;

/* eslint-disable @typescript-eslint/no-extraneous-class -- This is a DAL class */
import { and, eq } from "drizzle-orm";
import { db } from "../index";

export class RoleFeaturePermissionsDal {
  static async createPermission(
    input: DbNewRoleFeaturePermission,
  ): Promise<DbRoleFeaturePermission> {
    const [permission] = await db
      .insert(roleFeaturePermissionsModel)
      .values(input)
      .returning();

    return permission;
  }

  static async getPermissionsByRoleId(
    roleId: string,
  ): Promise<DbRoleFeaturePermission[]> {
    return await db
      .select()
      .from(roleFeaturePermissionsModel)
      .where(eq(roleFeaturePermissionsModel.roleId, roleId));
  }

  static async getPermissionsByFeatureId(
    featureId: string,
  ): Promise<DbRoleFeaturePermission[]> {
    return await db
      .select()
      .from(roleFeaturePermissionsModel)
      .where(eq(roleFeaturePermissionsModel.featureId, featureId));
  }

  static async deletePermission(
    roleId: string,
    featureId: string,
    permissionId: string,
  ): Promise<DbRoleFeaturePermission> {
    const [deletedPermission] = await db
      .delete(roleFeaturePermissionsModel)
      .where(
        and(
          eq(roleFeaturePermissionsModel.roleId, roleId),
          eq(roleFeaturePermissionsModel.featureId, featureId),
          eq(roleFeaturePermissionsModel.permissionId, permissionId),
        ),
      )
      .returning();

    return deletedPermission;
  }
}
