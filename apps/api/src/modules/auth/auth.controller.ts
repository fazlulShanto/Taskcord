import GlobalUtils from "@/utils/golabalUtils";
import type { FastifyReply, FastifyRequest } from "fastify";
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
        const query = request.query as {
            redirect_url?: string;
            invite_token?: string;
        };

        const clientRedirectUrl = this.authService.resolveClientRedirectUrl(
            query.redirect_url,
        );
        const state = this.authService.buildOAuthState({
            redirectUrl: clientRedirectUrl,
            inviteToken: query.invite_token,
        });

        await request.server.cacheDb.setex(
            `auth:oauth_state:${state}`,
            10 * 60,
            "1",
        );

        const url = this.authService.getDiscordAuthInitUrl(state);
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

        const storedState = await request.server.cacheDb.get(
            `auth:oauth_state:${state}`,
        );
        if (!storedState) {
            return reply.unauthorized("Invalid or expired OAuth state");
        }

        await request.server.cacheDb.del(`auth:oauth_state:${state}`);

        const parsedState = this.authService.parseOAuthState(state);

        const tokenResponse =
            await this.authService.exchangeCodeForAccessToken(code);

        const userInfoFromDiscord =
            await this.authService.getUserInfoFromDiscord(
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

        let inviteStatus = "none";
        let inviteProjectId = "";

        if (parsedState.inviteToken) {
            const inviteResult =
                await this.authService.acceptProjectInviteToken(
                    parsedState.inviteToken,
                    result,
                );
            inviteStatus = inviteResult.status;
            inviteProjectId = inviteResult.projectId ?? "";
        }

        return reply.redirect(
            `${parsedState.redirectUrl}/onboarding?auth_token=${jwtToken}&invite_status=${encodeURIComponent(inviteStatus)}&invite_project_id=${encodeURIComponent(inviteProjectId)}`,
        );
    }
}
