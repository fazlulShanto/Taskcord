/* eslint-disable no-bitwise -- needed for discord server list */
import type { DiscordServerListResponse } from "@/types/discord-auth";
import { faker } from "@faker-js/faker";
import {
    DbNewUser,
    ProjectRolesDal,
    UserDal,
    type DbUser,
} from "@taskcord/database";
import type AuthService from "../auth/auth.service";

export default class UserService {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public async me(userId: string): Promise<DbUser | null> {
        const user = await UserDal.getUserByDiscordId(userId);
        return user;
    }

    public async getUserDiscordServerList(
        accessToken: string,
    ): Promise<DiscordServerListResponse | null> {
        const baseUrl = "https://discord.com/api/v10/users/@me/guilds";
        let currentToken = accessToken;

        // First try with current access token
        let discordServerListResponse = await fetch(baseUrl, {
            headers: {
                Authorization: `Bearer ${currentToken}`,
            },
        });

        // If unauthorized (401), renew the token and try again
        if (discordServerListResponse.status === 401) {
            const tokenResponse =
                await this.authService.renewDiscordTokensByRefreshToken(
                    accessToken,
                );

            currentToken = tokenResponse.access_token;

            discordServerListResponse = await fetch(baseUrl, {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
            });
        }

        const discordServerList: DiscordServerListResponse =
            await discordServerListResponse.json();

        // return only the servers that the user is owner or has admin permissions
        const filteredServers = discordServerList.filter((server) => {
            const adminPermission = BigInt("8");
            const hasAdminPermission =
                (BigInt(server.permissions) & BigInt(adminPermission)) ===
                BigInt(adminPermission);
            return server.owner || hasAdminPermission;
        });

        return filteredServers;
    }

    public async createDummyUser(userCount: number): Promise<DbUser[]> {
        const users = [];

        for (let i = 0; i < userCount; i++) {
            const discordId = faker.number
                .bigInt({
                    min: "100000000000000000",
                    max: "999999999999999999",
                })
                .toString();
            const fullName = faker.person.fullName();
            const nickName = faker.person.firstName();
            const avatar = faker.image.urlLoremFlickr({ category: "people" });
            const email = faker.internet.email();
            const discordRefreshToken = faker.string.alphanumeric(30);
            const discordAccessToken = faker.string.alphanumeric(40);
            const now = new Date();
            const lastAuth = new Date(now.getTime() - 1000 * 60 * 60 * 24); // 1 day ago
            const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7); // 7 days from now
            const isVerified = true;
            const updatedAt = now;
            const createdAt = faker.date.between({
                from: "2025-05-01",
                to: now,
            });

            const dbUserData: DbNewUser = {
                discordId: discordId,
                fullName: fullName,
                nickName: nickName,
                avatar: avatar,
                email: email,
                discordRefreshToken: discordRefreshToken,
                discordAccessToken: discordAccessToken,
                discordAccessTokenExpiresAt: expiresAt,
                lastAuth: lastAuth,
                isVerified: isVerified,
                updatedAt: updatedAt,
                createdAt: createdAt,
            };

            users.push(dbUserData);
        }

        // create users in db
        const userPromises = [];
        for (const user of users) {
            userPromises.push(UserDal.createUser(user));
        }

        const createdUsers = await Promise.all(userPromises);

        return createdUsers;
    }

    public async getUsersByProjectIdWithRoles(projectId: string): Promise<
        {
            id: string;
            discordId: string;
            fullName: string | null;
            nickName: string | null;
            avatar: string | null;
            email: string | null;
            roles: Array<{ id: string; name: string; permissionCode: string }>;
        }[]
    > {
        const rows = await ProjectRolesDal.getProjectUsersWithRoles(projectId);
        const usersMap = new Map<
            string,
            {
                id: string;
                discordId: string;
                fullName: string | null;
                nickName: string | null;
                avatar: string | null;
                email: string | null;
                roles: Array<{
                    id: string;
                    name: string;
                    permissionCode: string;
                }>;
            }
        >();

        for (const row of rows) {
            if (!usersMap.has(row.userId)) {
                usersMap.set(row.userId, {
                    id: row.userId,
                    discordId: row.discordId,
                    fullName: row.fullName,
                    nickName: row.nickName,
                    avatar: row.avatar,
                    email: row.email,
                    roles: [],
                });
            }

            const user = usersMap.get(row.userId);

            if (user) {
                user.roles.push({
                    id: row.roleId,
                    name: row.roleName,
                    permissionCode: row.permissionCode,
                });
            }
        }

        return Array.from(usersMap.values());
    }
}
