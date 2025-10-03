import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

export const meRouteSchema = {
  response: {
    200: z.object({
      user: z.object({
        id: z.string().uuid(),
        discordId: z.string(),
        fullName: z.string(),
        nickName: z.string(),
        avatar: z.string(),
        email: z.string().email(),
        lastAuth: z.date(),
        isVerified: z.boolean(),
        updatedAt: z.date(),
        createdAt: z.date(),
      }),
    }),
    404: z.object({
      statusCode: z.literal(404),
      error: z.string(),
      message: z.string(),
    }),
  },
};

export const discordServerListRouteSchema = {
  response: {
    200: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        icon: z.string(),
        banner: z.string(),
        owner: z.boolean(),
        permissions: z.string(),
      }),
    ),
  },
};

export const { schemas: userSchemas, $ref: userSchemaRef } = buildJsonSchemas(
  {
    meResponse: meRouteSchema.response[200],
    meErrorResponse: meRouteSchema.response[404],
    discordServerListResponse: discordServerListRouteSchema.response[200],
  } as const,
  { $id: "userSchema" },
);
