import { eq } from "drizzle-orm";
import {
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { db } from "../index";
import { milestoneModel } from "./milestone.model";

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
    milestoneId: uuid("milestone_id").references(() => milestoneModel.id, {
        onDelete: "set null",
    }),
    assignees: jsonb("assignees").$type<string[]>().notNull().default([]),
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
    ): Promise<DbTask | null> {
        const result = await db
            .update(taskModel)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(taskModel.id, id))
            .returning();

        return result.at(0) ?? null;
    }

    static async deleteTask(id: string): Promise<DbTask | null> {
        const result = await db
            .delete(taskModel)
            .where(eq(taskModel.id, id))
            .returning();

        return result.at(0) ?? null;
    }
}
