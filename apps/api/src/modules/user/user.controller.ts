import type { FastifyReply, FastifyRequest } from "fastify";
import type UserService from "./user.service";

export default class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async me(request: FastifyRequest, reply: FastifyReply) {
    const userDiscordId = request.jwtUser.discordId;

    const dbUser = await this.userService.me(userDiscordId);

    if (!dbUser) {
      return reply.notFound();
    }
    return reply.send({
      user: dbUser,
    });
  }

  public async getUserDiscordServerList(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const userDiscordId = request.jwtUser.discordId;

    const dbUser = await this.userService.me(userDiscordId);

    if (!dbUser) {
      return reply.notFound();
    }

    const userAccessToken = dbUser.discordAccessToken;

    if (!userAccessToken) {
      return reply.notFound();
    }
    const discordServerList =
      await this.userService.getUserDiscordServerList(userAccessToken);

    return reply.send(discordServerList);
  }

  public async createDummyUsers(
    request: FastifyRequest<{ Querystring: { userCount?: number } }>,
    reply: FastifyReply,
  ) {
    const userCount = request.query.userCount || 10;
    const createdUsers = await this.userService.createDummyUser(userCount);
    return reply.send(createdUsers);
  }
}
