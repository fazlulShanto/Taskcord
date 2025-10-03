/* eslint-disable @typescript-eslint/no-extraneous-class -- This is a DAL class */
import { and, eq } from "drizzle-orm";
import { db } from "../index";
import {
  taskAssigneesModel,
  type DbTaskAssignee,
  type DbNewTaskAssignee,
} from "../models/task-assignees.model";

export class TaskAssigneesDal {
  static async assignUserToTask(
    input: DbNewTaskAssignee,
  ): Promise<DbTaskAssignee> {
    const [taskAssignee] = await db
      .insert(taskAssigneesModel)
      .values(input)
      .returning();

    return taskAssignee;
  }

  static async getTaskAssignees(taskId: string): Promise<DbTaskAssignee[]> {
    return await db
      .select()
      .from(taskAssigneesModel)
      .where(eq(taskAssigneesModel.taskId, taskId));
  }

  static async getUserAssignedTasks(userId: string): Promise<DbTaskAssignee[]> {
    return await db
      .select()
      .from(taskAssigneesModel)
      .where(eq(taskAssigneesModel.userId, userId));
  }

  static async removeUserFromTask(
    taskId: string,
    userId: string,
  ): Promise<DbTaskAssignee> {
    const [removedAssignee] = await db
      .delete(taskAssigneesModel)
      .where(
        and(
          eq(taskAssigneesModel.taskId, taskId),
          eq(taskAssigneesModel.userId, userId),
        ),
      )
      .returning();

    return removedAssignee;
  }
}
