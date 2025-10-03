import {
  ProjectDal,
  UserDal,
  type DbProject,
  type DbNewProject,
  ServerDal,
} from "@taskcord/database";

export default class ProjectService {
  public async createProject(
    userDiscordId: string,
    projectData: DbNewProject,
  ): Promise<DbProject> {
    // Get the user's UUID from their Discord ID
    const user = await UserDal.getUserByDiscordId(userDiscordId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create the project with the user as creator
    const project = await ProjectDal.createProject({
      title: projectData.title,
      description: projectData.description,
      managerId: projectData.managerId,
      discordServerId: projectData.discordServerId,
      creatorId: user.id,
    });

    return project;
  }

  public async getProject(id: string): Promise<DbProject | null> {
    return ProjectDal.getProjectById(id);
  }

  public async getAllProjects(creatorId: string): Promise<DbProject[]> {
    return ProjectDal.getProjectsByCreatorId(creatorId);
  }

  public async getUserProjects(userDiscordId: string): Promise<DbProject[]> {
    // Get the user's UUID from their Discord ID
    const user = await UserDal.getUserByDiscordId(userDiscordId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get projects where the user is the creator
    return ProjectDal.getProjectsByCreatorId(user.id);
  }

  public async getProjectsByManager(managerId: string): Promise<DbProject[]> {
    return ProjectDal.getProjectsByManagerId(managerId);
  }

  public async updateProject(
    id: string,
    projectData: Partial<DbNewProject>,
  ): Promise<DbProject | null> {
    // Convert date strings to Date objects if they exist
    const processedData: Partial<DbNewProject> = {
      ...projectData,
    };

    if (projectData.startingTimestamp) {
      processedData.startingTimestamp = new Date(projectData.startingTimestamp);
    }

    if (projectData.estimatedCompletionTimestamp) {
      processedData.estimatedCompletionTimestamp = new Date(
        projectData.estimatedCompletionTimestamp,
      );
    }

    try {
      return await ProjectDal.updateProject(id, processedData);
    } catch (error) {
      console.error("Error updating project:", error);
      return null;
    }
  }

  public async deleteProject(id: string): Promise<DbProject | null> {
    try {
      return await ProjectDal.deleteProject(id);
    } catch (error) {
      console.error("Error deleting project:", error);
      return null;
    }
  }
  public async isBotInServer(serverId: string): Promise<boolean> {
    const server = await ServerDal.getServerById(serverId);
    return server !== null && Boolean(server.ownerId);
  }
}
