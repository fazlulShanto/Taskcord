import { eq } from "drizzle-orm";
import {
    boolean,
    index,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { db } from "..";

export const githubWebhookDeliveriesModel = pgTable(
    "github_webhook_deliveries",
    {
        id: uuid("id")
            .primaryKey()
            .notNull()
            .$defaultFn(() => uuidv7()),
        deliveryId: varchar("delivery_id", { length: 255 }).notNull().unique(),
        eventType: varchar("event_type", { length: 128 }).notNull(),
        installationExternalId: varchar("installation_external_id", {
            length: 64,
        }),
        signatureVerified: boolean("signature_verified")
            .notNull()
            .default(false),
        status: varchar("status", { length: 32 }).notNull().default("received"),
        errorMessage: text("error_message"),
        payload: text("payload").notNull(),
        receivedAt: timestamp("received_at").defaultNow(),
        processedAt: timestamp("processed_at"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => ({
        deliveryIdIdx: index("github_webhook_deliveries_delivery_id_idx").on(
            table.deliveryId,
        ),
        eventTypeIdx: index("github_webhook_deliveries_event_type_idx").on(
            table.eventType,
        ),
    }),
);

export type DbGithubWebhookDelivery =
    typeof githubWebhookDeliveriesModel.$inferSelect;
export type DbNewGithubWebhookDelivery =
    typeof githubWebhookDeliveriesModel.$inferInsert;

export class GithubWebhookDeliveriesDal {
    static async createDelivery(
        input: DbNewGithubWebhookDelivery,
    ): Promise<DbGithubWebhookDelivery> {
        const [record] = await db
            .insert(githubWebhookDeliveriesModel)
            .values(input)
            .returning();

        return record;
    }

    static async getByDeliveryId(
        deliveryId: string,
    ): Promise<DbGithubWebhookDelivery | null> {
        const result = await db
            .select()
            .from(githubWebhookDeliveriesModel)
            .where(eq(githubWebhookDeliveriesModel.deliveryId, deliveryId))
            .limit(1);

        return result.at(0) ?? null;
    }

    static async markDeliveryProcessed(
        deliveryId: string,
        status: "accepted" | "failed",
        errorMessage?: string,
    ): Promise<DbGithubWebhookDelivery | null> {
        const [record] = await db
            .update(githubWebhookDeliveriesModel)
            .set({
                status,
                errorMessage,
                processedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(githubWebhookDeliveriesModel.deliveryId, deliveryId))
            .returning();

        return record ?? null;
    }
}
