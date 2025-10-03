/* eslint-disable @typescript-eslint/no-extraneous-class -- This is a DAL class */
import { eq } from "drizzle-orm";
import { db } from "../index";
import {
  permissionModel,
  type DbPermission,
  type DbNewPermission,
} from "../models/permission.model";

export class PermissionDal {
  static async createPermission(input: DbNewPermission): Promise<DbPermission> {
    const [permission] = await db
      .insert(permissionModel)
      .values(input)
      .returning();

    return permission;
  }

  static async getPermissionById(id: string): Promise<DbPermission | null> {
    const result = await db
      .select()
      .from(permissionModel)
      .where(eq(permissionModel.id, id))
      .limit(1);

    return result.at(0) ?? null;
  }

  static async getPermissionBySlug(slug: string): Promise<DbPermission | null> {
    const result = await db
      .select()
      .from(permissionModel)
      .where(eq(permissionModel.permissionSlug, slug))
      .limit(1);

    return result.at(0) ?? null;
  }

  static async getAllPermissions(): Promise<DbPermission[]> {
    return await db.select().from(permissionModel);
  }

  static async updatePermission(
    id: string,
    data: Partial<DbNewPermission>,
  ): Promise<DbPermission> {
    const [updatedPermission] = await db
      .update(permissionModel)
      .set(data)
      .where(eq(permissionModel.id, id))
      .returning();

    return updatedPermission;
  }

  static async deletePermission(id: string): Promise<DbPermission> {
    const [deletedPermission] = await db
      .delete(permissionModel)
      .where(eq(permissionModel.id, id))
      .returning();

    return deletedPermission;
  }
}
