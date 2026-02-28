import type {
    DiscordExchangeCodeResponse,
    DiscordUserInfoResponse,
} from "@/types/discord-auth";
import GlobalUtils from "@/utils/golabalUtils";
import {
    ProjectDefinedRolesDal,
    ProjectInvitesDal,
    ProjectRolesDal,
    UserDal,
    type DbUser,
} from "@taskcord/database";
import crypto from "node:crypto";

export type InviteAcceptStatus =
    | "joined"
    | "already_member"
    | "invalid"
    | "expired"
    | "revoked"
    | "restricted"
    | "error";

type OAuthStatePayload = {
    redirectUrl: string;
    inviteToken?: string;
};

export default class AuthService {
    private static readonly ALLOWED_REDIRECT_ORIGINS = new Set([
        "http://localhost:5173",
        "https://p005.netlify.app",
    ]);

    public resolveClientRedirectUrl(redirectUrl?: string) {
        const fallbackUrl =
            process.env.NODE_ENV === "prod"
                ? "https://p005.netlify.app"
                : "http://localhost:5173";

        if (!redirectUrl) {
            return fallbackUrl;
        }

        const parsedUrl = new URL(redirectUrl);

        if (!AuthService.ALLOWED_REDIRECT_ORIGINS.has(parsedUrl.origin)) {
            throw new Error("Invalid redirect URL origin");
        }

        return parsedUrl.toString();
    }

    public buildOAuthState(payload: OAuthStatePayload) {
        const nonce = crypto.randomBytes(16).toString("hex");
        const payloadEncoded = Buffer.from(
            JSON.stringify(payload),
            "utf-8",
        ).toString("base64url");
        return `${nonce}.${payloadEncoded}`;
    }

    public parseOAuthState(state: string): OAuthStatePayload {
        const encodedPayload = state.split(".").at(1);

        if (!encodedPayload) {
            throw new Error("Invalid OAuth state");
        }

        const parsedPayload = JSON.parse(
            Buffer.from(encodedPayload, "base64url").toString("utf-8"),
        ) as OAuthStatePayload;

        return {
            redirectUrl: this.resolveClientRedirectUrl(
                parsedPayload.redirectUrl,
            ),
            inviteToken: parsedPayload.inviteToken,
        };
    }

    public getDiscordAuthInitUrl(state: string) {
        const apiBaseUrl = GlobalUtils.getApiHostUrl();
        const url = new URL("https://discord.com/oauth2/authorize");
        url.searchParams.set("client_id", process.env.DISCORD_AUTH_CLIENT_ID!);
        url.searchParams.set("response_type", "code");
        url.searchParams.set(
            "redirect_uri",
            apiBaseUrl + process.env.DISCORD_OAUTH_REDIRECT_URL!,
        );
        url.searchParams.set("scope", `${process.env.DISCORD_OAUTH_SCOPES}`);
        url.searchParams.set("state", state);
        return url.toString();
    }

    public async exchangeCodeForAccessToken(
        code: string,
    ): Promise<DiscordExchangeCodeResponse> {
        const apiBaseUrl = GlobalUtils.getApiHostUrl();
        const API_ENDPOINT = `https://discord.com/api/v10/oauth2/token`;
        const CLIENT_ID = process.env.DISCORD_AUTH_CLIENT_ID!;
        const CLIENT_SECRET = process.env.DISCORD_AUTH_CLIENT_SECRET!;

        const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
            "base64",
        );
        const requestData = {
            grant_type: "authorization_code",
            code,
            redirect_uri: `${apiBaseUrl}/api/edge/auth/discord/oauth-callback`,
        };
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            body: new URLSearchParams(requestData).toString(),
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const data: DiscordExchangeCodeResponse = await response.json();
        return data;
    }

    private hashInviteToken(inviteToken: string): string {
        return crypto.createHash("sha256").update(inviteToken).digest("hex");
    }

    private async resolveRoleIdForInvite(
        projectId: string,
        roleId?: string | null,
    ) {
        if (roleId) {
            const explicitRole =
                await ProjectDefinedRolesDal.getRoleById(roleId);
            if (explicitRole && explicitRole.projectId === projectId) {
                return explicitRole.id;
            }
        }

        const roles =
            await ProjectDefinedRolesDal.getRolesByProjectId(projectId);
        const fallbackRole =
            roles.find((role) => role.roleName.toLowerCase() === "member") ??
            roles.find(
                (role) => role.roleName.toLowerCase() === "contributor",
            ) ??
            roles.find((role) => role.roleName.toLowerCase() === "viewer") ??
            roles.at(0);

        return fallbackRole?.id;
    }

    public async acceptProjectInviteToken(
        inviteToken: string,
        user: DbUser,
    ): Promise<{ status: InviteAcceptStatus; projectId?: string }> {
        try {
            const tokenHash = this.hashInviteToken(inviteToken);
            const invite =
                await ProjectInvitesDal.getInviteByTokenHash(tokenHash);

            if (!invite) {
                return { status: "invalid" };
            }

            if (invite.revokedAt) {
                return { status: "revoked", projectId: invite.projectId };
            }

            if (invite.expiresAt <= new Date()) {
                return { status: "expired", projectId: invite.projectId };
            }

            if (invite.usedCount >= invite.maxUses) {
                return { status: "invalid", projectId: invite.projectId };
            }

            if (
                invite.restrictionType === "email" &&
                invite.restrictedEmail &&
                invite.restrictedEmail.toLowerCase() !==
                    (user.email ?? "").toLowerCase()
            ) {
                return { status: "restricted", projectId: invite.projectId };
            }

            if (
                invite.restrictionType === "discord_id" &&
                invite.restrictedDiscordId &&
                invite.restrictedDiscordId !== user.discordId
            ) {
                return { status: "restricted", projectId: invite.projectId };
            }

            const existingRoles = await ProjectRolesDal.getUserRolesByProjectId(
                invite.projectId,
                user.id,
            );

            if (existingRoles.length > 0) {
                return {
                    status: "already_member",
                    projectId: invite.projectId,
                };
            }

            const roleId = await this.resolveRoleIdForInvite(
                invite.projectId,
                invite.roleId,
            );

            if (!roleId) {
                return { status: "error", projectId: invite.projectId };
            }

            const consumedInvite = await ProjectInvitesDal.consumeInvite(
                tokenHash,
                user.id,
            );
            if (!consumedInvite) {
                return { status: "invalid", projectId: invite.projectId };
            }

            await ProjectRolesDal.assignRole({
                projectId: invite.projectId,
                userId: user.id,
                roleId,
            });

            return { status: "joined", projectId: invite.projectId };
        } catch (error) {
            console.error("Failed to accept project invite", error);
            return { status: "error" };
        }
    }

    public async getUserInfoFromDiscord(accessToken: string) {
        const API_ENDPOINT = `https://discord.com/api/v10/users/@me`;
        const response = await fetch(API_ENDPOINT, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.json() as Promise<DiscordUserInfoResponse>;
    }

    public async renewDiscordTokensByRefreshToken(refreshToken: string) {
        const API_ENDPOINT = `https://discord.com/api/v10/oauth2/token`;
        const CLIENT_ID = process.env.DISCORD_AUTH_CLIENT_ID!;
        const CLIENT_SECRET = process.env.DISCORD_AUTH_CLIENT_SECRET!;

        const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
            "base64",
        );

        const requestData = {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        };

        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            body: new URLSearchParams(requestData).toString(),
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const data: DiscordExchangeCodeResponse = await response.json();
        return data;
    }

    public async getUserByDiscordId(discordId: string) {
        const dbUser = await UserDal.getUserByDiscordId(discordId);
        return dbUser;
    }

    public async handleDiscordLogin(
        discordUser: DiscordUserInfoResponse,
        tokenResponse: DiscordExchangeCodeResponse,
    ) {
        let existingUser = await UserDal.getUserByDiscordId(discordUser.id);

        const updatedUser = {
            discordId: discordUser.id,
            avatar: discordUser.avatar,
            fullName: discordUser.username,
            discordRefreshToken: tokenResponse.refresh_token,
            discordAccessToken: tokenResponse.access_token,
            discordAccessTokenExpiresAt: new Date(
                Date.now() + tokenResponse.expires_in * 1000,
            ),
            lastAuth: new Date(),
            email: discordUser.email,
        };

        if (!existingUser) {
            // create user
            existingUser = await UserDal.createUser(updatedUser);
        } else {
            // update user
            existingUser = await UserDal.updateUserByDiscordId(
                existingUser.discordId,
                updatedUser,
            );
        }
        return existingUser;
    }

    public async updateUserDiscordTokens(
        dbuser: DbUser,
    ): Promise<DbUser | null> {
        const refreshToken = dbuser.discordRefreshToken;
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }

        const newTokenResponse =
            await this.renewDiscordTokensByRefreshToken(refreshToken);

        const user = await UserDal.updateUserByDiscordId(dbuser.discordId, {
            discordRefreshToken: newTokenResponse.refresh_token,
            discordAccessToken: newTokenResponse.access_token,
            discordAccessTokenExpiresAt: new Date(
                Date.now() + newTokenResponse.expires_in * 1000,
            ),
        });
        return user;
    }
}
