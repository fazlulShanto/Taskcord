import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { milestoneModel } from "./milestone.model";
import { taskModel } from "./task.model";

export const milestoneTasksModel = pgTable(
  "milestone_tasks",
  {
    milestoneId: uuid("milestone_id")
      .notNull()
      .references(() => milestoneModel.id),
    taskId: uuid("task_id")
      .notNull()
      .references(() => taskModel.id),
  },
  (table) => ({
    primary: primaryKey(table.milestoneId, table.taskId),
  }),
);

export type DbMilestoneTask = typeof milestoneTasksModel.$inferSelect;
export type DbNewMilestoneTask = typeof milestoneTasksModel.$inferInsert;

/* eslint-disable @typescript-eslint/no-extraneous-class -- This is a DAL class */
import { and, eq } from "drizzle-orm";
import { db } from "../index";

export class MilestoneTasksDal {
  static async addTaskToMilestone(
    input: DbNewMilestoneTask,
  ): Promise<DbMilestoneTask> {
    const [milestoneTask] = await db
      .insert(milestoneTasksModel)
      .values(input)
      .returning();

    return milestoneTask;
  }

  static async getMilestoneTasks(
    milestoneId: string,
  ): Promise<DbMilestoneTask[]> {
    return await db
      .select()
      .from(milestoneTasksModel)
      .where(eq(milestoneTasksModel.milestoneId, milestoneId));
  }

  static async removeTaskFromMilestone(
    milestoneId: string,
    taskId: string,
  ): Promise<DbMilestoneTask> {
    const [removedTask] = await db
      .delete(milestoneTasksModel)
      .where(
        and(
          eq(milestoneTasksModel.milestoneId, milestoneId),
          eq(milestoneTasksModel.taskId, taskId),
        ),
      )
      .returning();

    return removedTask;
  }
}
