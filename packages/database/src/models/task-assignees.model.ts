import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { taskModel } from "./task.model";
import { usersModel } from "./user.model";

export const taskAssigneesModel = pgTable(
  "task_assignees",
  {
    taskId: uuid("task_id")
      .notNull()
      .references(() => taskModel.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersModel.id),
  },
  (table) => ({
    primary: primaryKey(table.taskId, table.userId),
  }),
);

export type DbTaskAssignee = typeof taskAssigneesModel.$inferSelect;
export type DbNewTaskAssignee = typeof taskAssigneesModel.$inferInsert;
