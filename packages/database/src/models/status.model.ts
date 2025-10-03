import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { eq, inArray } from "drizzle-orm";
import { db } from "../index";
import { projectModel } from "./project.model";

export const statusModel = pgTable("statuses", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv7()),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectModel.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  description: text("description"),
  creatorId: uuid("creator_id").notNull(),
  color: varchar("color").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type DbStatus = typeof statusModel.$inferSelect;
export type DbNewStatus = typeof statusModel.$inferInsert;

// Status DAL 🟩

export class StatusDal {
  static async createStatus(input: DbNewStatus): Promise<DbStatus> {
    const [status] = await db.insert(statusModel).values(input).returning();
    return status;
  }

  static async getStatusById(id: string): Promise<DbStatus | null> {
    const result = await db
      .select()
      .from(statusModel)
      .where(eq(statusModel.id, id))
      .limit(1);

    return result.at(0) ?? null;
  }

  static async getStatusesByProjectId(projectId: string): Promise<DbStatus[]> {
    return await db
      .select()
      .from(statusModel)
      .where(eq(statusModel.projectId, projectId));
  }

  static async updateStatus(
    id: string,
    data: Partial<DbNewStatus>,
  ): Promise<DbStatus> {
    const [status] = await db
      .update(statusModel)
      .set(data)
      .where(eq(statusModel.id, id))
      .returning();

    return status;
  }

  static async deleteStatus(id: string): Promise<DbStatus> {
    const [status] = await db
      .delete(statusModel)
      .where(eq(statusModel.id, id))
      .returning();

    return status;
  }
  static async deleteStatusBulk(ids: string[]): Promise<DbStatus[]> {
    const statuses = await db
      .delete(statusModel)
      .where(inArray(statusModel.id, ids))
      .returning();
    return statuses;
  }
}
