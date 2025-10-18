/* eslint-disable @typescript-eslint/no-unnecessary-condition -- ensure that the environment is set */
/* eslint-disable @typescript-eslint/no-extraneous-class -- This is a utility class */

import dotenv from "dotenv";
import { buildJsonSchemas } from "fastify-zod";
import jwt from "jsonwebtoken";
import type { z } from "zod";

dotenv.config();

class GlobalUtils {
    private static currentEnv = process.env.NODE_ENV || "local";

    public static getApiHostUrl(): string {
        return process.env.BACKEND_HOST_URL || "http://localhost:4005";
    }

    public static getRedisUrl(): string | undefined {
        return process.env.REDIS_URL;
    }

    public static getPostgresUrl(): string | undefined {
        return process.env.PG_DB_URL;
    }

    public static getDiscordOAuthRedirectUrl(): string {
        const apiHostUrl = this.getApiHostUrl();
        return apiHostUrl + process.env.DISCORD_OAUTH_REDIRECT_URL!;
    }

    public static verifyJwtToken(token: string) {
        const secret = process.env.JWT_SECRET!;
        if (!secret) {
            throw new Error("JWT_SECRET is not set");
        }
        return jwt.verify(token, secret);
    }

    public static signJwtToken(payload: Record<string, unknown>) {
        const secret = process.env.JWT_SECRET!;
        if (!secret) {
            throw new Error("JWT_SECRET is not set");
        }
        const maxAge = process.env.JWT_MAX_AGE! || "7d";
        const token = jwt.sign(payload, secret, {
            expiresIn: maxAge as unknown as number,
        });

        return token;
    }

    public static getCurrentEnv(): string {
        return this.currentEnv;
    }

    public static zodToSchema(schema: Record<string, z.ZodType>) {
        return buildJsonSchemas(schema).schemas[0];
    }
}

export default GlobalUtils;
