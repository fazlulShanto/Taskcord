import { eq, inArray } from "drizzle-orm";
import {
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { db } from "../index";
import { projectModel } from "./project.model";

export const taskTypeModel = pgTable("task_types", {
    id: uuid("id")
        .primaryKey()
        .notNull()
        .$defaultFn(() => uuidv7()),
    projectId: uuid("project_id")
        .notNull()
        .references(() => projectModel.id, { onDelete: "cascade" }),
    creatorId: uuid("creator_id").notNull(),
    name: varchar("name").notNull(),
    description: text("description"),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type DbTaskType = typeof taskTypeModel.$inferSelect;
export type DbNewTaskType = typeof taskTypeModel.$inferInsert;

export class TaskTypeDal {
    static async createTaskType(input: DbNewTaskType): Promise<DbTaskType> {
        const [taskType] = await db
            .insert(taskTypeModel)
            .values(input)
            .returning();

        return taskType;
    }

    static async getTaskTypeById(id: string): Promise<DbTaskType | null> {
        const result = await db
            .select()
            .from(taskTypeModel)
            .where(eq(taskTypeModel.id, id))
            .limit(1);

        return result.at(0) ?? null;
    }

    static async getTaskTypesByProjectId(
        projectId: string,
    ): Promise<DbTaskType[]> {
        return await db
            .select()
            .from(taskTypeModel)
            .where(eq(taskTypeModel.projectId, projectId));
    }

    static async updateTaskType(
        id: string,
        data: Partial<DbNewTaskType>,
    ): Promise<DbTaskType> {
        const [taskType] = await db
            .update(taskTypeModel)
            .set(data)
            .where(eq(taskTypeModel.id, id))
            .returning();

        return taskType;
    }

    static async deleteTaskType(id: string): Promise<DbTaskType> {
        const [taskType] = await db
            .delete(taskTypeModel)
            .where(eq(taskTypeModel.id, id))
            .returning();

        return taskType;
    }

    static async deleteTaskTypesBulk(ids: string[]): Promise<DbTaskType[]> {
        return await db
            .delete(taskTypeModel)
            .where(inArray(taskTypeModel.id, ids))
            .returning();
    }
}
