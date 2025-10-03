import type { FastifyReply, FastifyRequest } from "fastify";
import GlobalUtils from "@/utils/golabalUtils";
import type AuthService from "./auth.service";

export default class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async initializeDiscordAuthFlowHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const clientRedirectUrl = (request.query as { redirect_url: string })
      .redirect_url;

    const url = this.authService.getDiscordAuthInitUrl(clientRedirectUrl);
    return reply.redirect(url);
  }

  public async handleDiscordOAuthCallback(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { code, state } = request.query as {
      code: string;
      state: string;
    };
    //retrive redirect url from state
    const clientRedirectUrl = state.split("_").pop() || "";
    // TODO: store state in redis and varify here
    const tokenResponse =
      await this.authService.exchangeCodeForAccessToken(code);

    const userInfoFromDiscord = await this.authService.getUserInfoFromDiscord(
      tokenResponse.access_token,
    );

    const result = await this.authService.handleDiscordLogin(
      userInfoFromDiscord,
      tokenResponse,
    );

    const userInfo = {
      discordId: result.discordId,
      fullName: result.fullName,
      avatar: result.avatar,
      email: result.email,
      id: result.id,
    };
    const jwtToken = GlobalUtils.signJwtToken(userInfo);
    // update jwt to redis
    await request.server.cacheDb.setex(
      `auth:jwt:${result.discordId}`,
      7 * 24 * 60 * 60,
      jwtToken,
    );

    return reply.redirect(
      `${atob(clientRedirectUrl)}/onboarding?auth_token=${jwtToken}`,
    );
  }
}
