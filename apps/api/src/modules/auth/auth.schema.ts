import { zodSchemasToJSONSchema } from "@/utils/schemaHelper";
import { z } from "zod/v4";

const queryParamsSchema = z
    .object({
        code: z.string().nonempty(),
        state: z.string().min(5),
    })
    .meta({ $id: "queryParams" });

const auth200ResponseSchema = z
    .object({
        access_token: z.string(),
        token_type: z.string(),
        expires_in: z.number(),
        refresh_token: z.string(),
        scope: z.string(),
    })
    .meta({ $id: "200" });

const authInitQueryParamsSchema = z
    .object({
        redirect_url: z.enum([
            "http://localhost:5173",
            "https://p005.netlify.app",
        ]),
    })
    .meta({ $id: "authInitQueryParams" });

export type QueryParams = z.infer<typeof queryParamsSchema>;
export type Auth200Response = z.infer<typeof auth200ResponseSchema>;
export type AuthInitQueryParams = z.infer<typeof authInitQueryParamsSchema>;

export const zodAuthSchemas = zodSchemasToJSONSchema([
    queryParamsSchema,
    auth200ResponseSchema,
    authInitQueryParamsSchema,
]);
