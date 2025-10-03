import type { FastifyReply, FastifyRequest } from "fastify";
import type UtilityService from "./utility.service";

export default class UtilityController {
  private utilityService: UtilityService;

  constructor(utilityService: UtilityService) {
    this.utilityService = utilityService;
  }

  public async getApiUptimeHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    try {
      const uptime = this.utilityService.getApiUptime();

      return reply.code(200).send(uptime);
    } catch (e) {
      if (e instanceof Error) {
        return reply.badRequest(e.message);
      }

      /* istanbul ignore next */
      throw e;
    }
  }

  public async getApiStatusHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    try {
      const status = this.utilityService.getApiStatus();
      return reply.code(200).send(status);
    } catch (e) {
      return reply.badRequest("Something went wrong");
    }
  }

  public async getServerHardwareInfoHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const info = this.utilityService.getServerHardwareInfo();

    return reply.code(200).send(info);
  }

  public async cookieTestHandler(request: FastifyRequest, reply: FastifyReply) {
    const isSecure = request.protocol === "https";
    const isProdOrStage = ["prod", "staging"].includes(process.env.NODE_ENV);
    const cookiesData = request.body as Record<string, string>;
    const keys = Object.keys(cookiesData);
    for (const key of keys) {
      reply.setCookie(key, cookiesData[key], {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      });
    }
    return reply
      .code(200)
      .send({ message: "done", cookiesData, isSecure, isProdOrStage });
  }
}
