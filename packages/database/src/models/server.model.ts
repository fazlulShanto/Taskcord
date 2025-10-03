/* eslint-disable @typescript-eslint/no-extraneous-class -- This is a DAL class */
import { pgTable, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { db } from "../index";

export const serverModel = pgTable("servers", {
  serverId: varchar("server_id").notNull().primaryKey(),
  ownerId: varchar("owner_id").notNull(),
  serverLogo: varchar("server_logo"),
  serverName: varchar("server_name").default(""),
  isBotInServer: boolean("is_bot_in_server").default(false),
  lastUpdatedAt: timestamp("last_updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DbServer = typeof serverModel.$inferSelect;
export type DbNewServer = typeof serverModel.$inferInsert;

export class ServerDal {
  static async createServer(input: DbNewServer): Promise<DbServer> {
    const [server] = await db
      .insert(serverModel)
      .values(input)
      .onConflictDoUpdate({
        target: serverModel.serverId,
        set: {
          serverName: input.serverName,
          serverLogo: input.serverLogo,
          ownerId: input.ownerId,
          lastUpdatedAt: new Date(),
          isBotInServer: input.isBotInServer,
        },
      })
      .returning();
    return server;
  }

  static async getServerById(id: string): Promise<DbServer | null> {
    const result = await db
      .select()
      .from(serverModel)
      .where(eq(serverModel.serverId, id))
      .limit(1);

    return result.at(0) ?? null;
  }

  static async getServerByOwnerId(ownerId: string): Promise<DbServer | null> {
    const result = await db
      .select()
      .from(serverModel)
      .where(eq(serverModel.ownerId, ownerId))
      .limit(1);

    return result.at(0) ?? null;
  }

  static async updateServer(
    id: string,
    data: Partial<DbNewServer>,
  ): Promise<DbServer> {
    const [updatedServer] = await db
      .update(serverModel)
      .set(data)
      .where(eq(serverModel.serverId, id))
      .returning();

    return updatedServer;
  }

  static async deleteServer(id: string): Promise<DbServer> {
    const [deletedServer] = await db
      .delete(serverModel)
      .where(eq(serverModel.serverId, id))
      .returning();

    return deletedServer;
  }
}
