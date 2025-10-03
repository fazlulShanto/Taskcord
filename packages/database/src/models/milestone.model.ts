import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { projectModel } from "./project.model";
import { eq } from "drizzle-orm";
import { db } from "../index";

export const milestoneModel = pgTable("milestones", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv7()),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectModel.id),
  title: varchar("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: varchar("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type DbMilestone = typeof milestoneModel.$inferSelect;
export type DbNewMilestone = typeof milestoneModel.$inferInsert;

export class MilestoneDal {
  static async createMilestone(input: DbNewMilestone): Promise<DbMilestone> {
    const [milestone] = await db
      .insert(milestoneModel)
      .values(input)
      .returning();

    return milestone;
  }

  static async getMilestoneById(id: string): Promise<DbMilestone | null> {
    const result = await db
      .select()
      .from(milestoneModel)
      .where(eq(milestoneModel.id, id))
      .limit(1);

    return result.at(0) ?? null;
  }

  static async getProjectMilestones(projectId: string): Promise<DbMilestone[]> {
    return await db
      .select()
      .from(milestoneModel)
      .where(eq(milestoneModel.projectId, projectId));
  }

  static async updateMilestone(
    id: string,
    data: Partial<DbNewMilestone>,
  ): Promise<DbMilestone> {
    const [updatedMilestone] = await db
      .update(milestoneModel)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(milestoneModel.id, id))
      .returning();

    return updatedMilestone;
  }

  static async deleteMilestone(id: string): Promise<DbMilestone> {
    const [deletedMilestone] = await db
      .delete(milestoneModel)
      .where(eq(milestoneModel.id, id))
      .returning();

    return deletedMilestone;
  }
}
