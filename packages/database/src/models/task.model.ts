import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { eq, and } from "drizzle-orm";
import { db } from "../index";

export const taskModel = pgTable("tasks", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv7()),
  projectId: uuid("project_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  creatorId: uuid("creator_id").notNull(),
  status: varchar("status").notNull().default("TODO"),
  priority: varchar("priority").notNull().default("MEDIUM"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type DbTask = typeof taskModel.$inferSelect;
export type DbNewTask = typeof taskModel.$inferInsert;

// Task DAL 🟩

export class TaskDal {
  static async createTask(input: DbNewTask): Promise<DbTask> {
    const [task] = await db.insert(taskModel).values(input).returning();

    return task;
  }

  static async getTaskById(id: string): Promise<DbTask | null> {
    const result = await db
      .select()
      .from(taskModel)
      .where(eq(taskModel.id, id))
      .limit(1);

    return result.at(0) ?? null;
  }

  static async getTasksByProjectId(projectId: string): Promise<DbTask[]> {
    return await db
      .select()
      .from(taskModel)
      .where(eq(taskModel.projectId, projectId));
  }

  static async getTasksByCreatorId(creatorId: string): Promise<DbTask[]> {
    return await db
      .select()
      .from(taskModel)
      .where(eq(taskModel.creatorId, creatorId));
  }

  static async updateTask(
    id: string,
    data: Partial<DbNewTask>,
  ): Promise<DbTask> {
    const [updatedTask] = await db
      .update(taskModel)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(taskModel.id, id))
      .returning();

    return updatedTask;
  }

  static async deleteTask(id: string): Promise<DbTask> {
    const [deletedTask] = await db
      .delete(taskModel)
      .where(eq(taskModel.id, id))
      .returning();

    return deletedTask;
  }
}
