import crypto from "node:crypto";
import { UserDal, type DbUser } from "@taskcord/database";
import GlobalUtils from "@/utils/golabalUtils";
import type {
  DiscordExchangeCodeResponse,
  DiscordUserInfoResponse,
} from "@/types/discord-auth";

export default class AuthService {
  private generateState(data: string) {
    return `${crypto.randomBytes(16).toString("hex")}_${btoa(data)}`;
  }

  public getDiscordAuthInitUrl(redirectUrl = "") {
    const apiBaseUrl = GlobalUtils.getApiHostUrl();
    const clientAuthRedirectUrl =
      redirectUrl || apiBaseUrl + process.env.DISCORD_OAUTH_REDIRECT_URL!;
    const state = this.generateState(clientAuthRedirectUrl);
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

  public async updateUserDiscordTokens(dbuser: DbUser): Promise<DbUser | null> {
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
