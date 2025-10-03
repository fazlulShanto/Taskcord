import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type ProjectService from "./project.service";

export default class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  // Create a new project
  public async createProject(
    request: FastifyRequest<{ Body: z.infer<typeof createProjectSchema> }>,
    reply: FastifyReply,
  ) {
    const userDiscordId = request.jwtUser.discordId;
    const projectData = request.body;

    const project = await this.projectService.createProject(userDiscordId, {
      title: projectData.title,
      description: projectData.description,
      creatorId: request.jwtUser.id,
      managerId: userDiscordId,
      discordServerId: request.body.discordServerId,
      startingTimestamp: projectData.startingTimestamp
        ? new Date(projectData.startingTimestamp)
        : null,
      estimatedCompletionTimestamp: projectData.estimatedCompletionTimestamp
        ? new Date(projectData.estimatedCompletionTimestamp)
        : null,
    });
    return reply.code(201).send({ project });
  }

  public async getProject(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const project = await this.projectService.getProject(id);
    if (!project) {
      return reply.notFound("Project not found");
    }

    return reply.send({ project });
  }

  public async getAllProjects(request: FastifyRequest, reply: FastifyReply) {
    const projects = await this.projectService.getAllProjects(
      request.jwtUser.id,
    );
    return reply.send({ projects });
  }

  public async getUserProjects(request: FastifyRequest, reply: FastifyReply) {
    const userDiscordId = request.jwtUser.discordId;

    const projects = await this.projectService.getUserProjects(userDiscordId);
    return reply.send({ projects });
  }

  public async updateProject(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const projectData = request.body as z.infer<typeof updateProjectSchema>;

    const project = await this.projectService.updateProject(id, {
      ...projectData,
      startingTimestamp: projectData.startingTimestamp
        ? new Date(projectData.startingTimestamp)
        : undefined,
      estimatedCompletionTimestamp: projectData.estimatedCompletionTimestamp
        ? new Date(projectData.estimatedCompletionTimestamp)
        : undefined,
    });
    if (!project) {
      return reply.notFound("Project not found");
    }

    return reply.send({ project });
  }

  public async deleteProject(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const project = await this.projectService.deleteProject(id);
    if (!project) {
      return reply.notFound("Project not found");
    }

    return reply.send({ project });
  }
  public async isBotInServer(request: FastifyRequest, reply: FastifyReply) {
    const { server_id: serverId } = request.params as { server_id: string };

    const isBotInServer = await this.projectService.isBotInServer(serverId);
    if (!isBotInServer) {
      return reply.notFound("Bot is not found in the server");
    }

    return reply.send({ ok: isBotInServer });
  }
}

// These are just for type checking in the controller
const createProjectSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  managerId: z.string(),
  discordServerId: z.string(),
  status: z.string().optional(),
  logo: z.string().optional(),
  startingTimestamp: z.string().optional(),
  estimatedCompletionTimestamp: z.string().optional(),
});

const updateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  managerId: z.string().optional(),
  status: z.string().optional(),
  logo: z.string().optional(),
  startingTimestamp: z.string().optional(),
  estimatedCompletionTimestamp: z.string().optional(),
});

const _projectResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  managerId: z.string(),
  status: z.string().optional(),
  logo: z.string().optional(),
  startingTimestamp: z.string().optional(),
  estimatedCompletionTimestamp: z.string().optional(),
  creatorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
