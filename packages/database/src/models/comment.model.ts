import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { taskModel } from "./task.model";
import { usersModel } from "./user.model";

export const commentModel = pgTable("comments", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv7()),
  taskId: uuid("task_id")
    .notNull()
    .references(() => taskModel.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersModel.id),
  parentCommentId: uuid("parent_comment_id").references(
    (): AnyPgColumn => commentModel.id,
  ),
  content: text("content").notNull(),
  attachments: jsonb("attachments"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type DbComment = typeof commentModel.$inferSelect;
export type DbNewComment = typeof commentModel.$inferInsert;

/* eslint-disable @typescript-eslint/no-extraneous-class -- This is a DAL class */
import { eq } from "drizzle-orm";
import { db } from "../index";

export class CommentDal {
  static async createComment(input: DbNewComment): Promise<DbComment> {
    const [comment] = await db.insert(commentModel).values(input).returning();

    return comment;
  }

  static async getCommentById(id: string): Promise<DbComment | null> {
    const result = await db
      .select()
      .from(commentModel)
      .where(eq(commentModel.id, id))
      .limit(1);

    return result.at(0) ?? null;
  }

  static async getTaskComments(taskId: string): Promise<DbComment[]> {
    return await db
      .select()
      .from(commentModel)
      .where(eq(commentModel.taskId, taskId));
  }

  static async getCommentReplies(
    parentCommentId: string,
  ): Promise<DbComment[]> {
    return await db
      .select()
      .from(commentModel)
      .where(eq(commentModel.parentCommentId, parentCommentId));
  }

  static async updateComment(
    id: string,
    data: Partial<DbNewComment>,
  ): Promise<DbComment> {
    const [updatedComment] = await db
      .update(commentModel)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(commentModel.id, id))
      .returning();

    return updatedComment;
  }

  static async deleteComment(id: string): Promise<DbComment> {
    const [deletedComment] = await db
      .delete(commentModel)
      .where(eq(commentModel.id, id))
      .returning();

    return deletedComment;
  }
}
