/* eslint-disable @typescript-eslint/no-extraneous-class -- This is a DAL class */
import { eq } from "drizzle-orm";
import { db } from "../index";
import {
  projectModel,
  type DbProject,
  type DbNewProject,
} from "../models/project.model";

export class ProjectDal {
  /**
   * Creates a new project in the database
   */
  static async createProject(input: DbNewProject): Promise<DbProject> {
    const [project] = await db
      .insert(projectModel)
      .values({
        title: input.title,
        description: input.description,
        creatorId: input.creatorId,
        managerId: input.managerId,
        discordServerId: input.discordServerId,
      })
      .returning();

    return project;
  }

  /**
   * Retrieves a project by its ID
   * Returns null if project is not found
   */
  static async getProjectById(id: string): Promise<DbProject | null> {
    const result = await db
      .select()
      .from(projectModel)
      .where(eq(projectModel.id, id))
      .limit(1);

    return result.at(0) ?? null;
  }

  /**
   * Retrieves all projects
   */
  static async getAllProjects(): Promise<DbProject[]> {
    return await db.select().from(projectModel);
  }

  /**
   * Retrieves all projects for a specific creator
   */
  static async getProjectsByCreatorId(creatorId: string): Promise<DbProject[]> {
    return await db
      .select()
      .from(projectModel)
      .where(eq(projectModel.creatorId, creatorId));
  }

  /**
   * Retrieves all projects for a specific manager (by Discord ID)
   */
  static async getProjectsByManagerId(managerId: string): Promise<DbProject[]> {
    return await db
      .select()
      .from(projectModel)
      .where(eq(projectModel.managerId, managerId));
  }

  /**
   * Retrieves all projects with a specific status
   */
  static async getProjectsByStatus(status: string): Promise<DbProject[]> {
    return await db
      .select()
      .from(projectModel)
      .where(eq(projectModel.status, status));
  }

  /**
   * Updates an existing project's information
   */
  static async updateProject(
    id: string,
    data: Partial<DbNewProject>,
  ): Promise<DbProject> {
    const [updatedProject] = await db
      .update(projectModel)
      .set(data)
      .where(eq(projectModel.id, id))
      .returning();

    return updatedProject;
  }

  /**
   * Updates a project's status
   */
  static async updateProjectStatus(
    id: string,
    status: string,
  ): Promise<DbProject> {
    const [updatedProject] = await db
      .update(projectModel)
      .set({ status })
      .where(eq(projectModel.id, id))
      .returning();

    return updatedProject;
  }

  /**
   * Marks a project as completed
   */
  static async completeProject(id: string): Promise<DbProject> {
    const [completedProject] = await db
      .update(projectModel)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(projectModel.id, id))
      .returning();

    return completedProject;
  }

  /**
   * Deletes a project by its ID
   * Returns the deleted project
   */
  static async deleteProject(id: string): Promise<DbProject> {
    const [deletedProject] = await db
      .delete(projectModel)
      .where(eq(projectModel.id, id))
      .returning();

    return deletedProject;
  }
}
