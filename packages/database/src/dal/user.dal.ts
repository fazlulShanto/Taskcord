/* eslint-disable @typescript-eslint/no-extraneous-class -- This is a DAL class */
import { eq } from "drizzle-orm";
import { db } from "../index";
import { usersModel, type DbUser, type DbNewUser } from "../models/user.model";

export class UserDal {
  /**
   * Creates a new user in the database
   */
  static async createUser(input: DbNewUser): Promise<DbUser> {
    const [user] = await db
      .insert(usersModel)
      .values({
        discordId: input.discordId,
        fullName: input.fullName,
        nickName: input.fullName,
        avatar: input.avatar,
        email: input.email,
        discordRefreshToken: input.discordRefreshToken,
        discordAccessToken: input.discordAccessToken,
        discordAccessTokenExpiresAt: input.discordAccessTokenExpiresAt,
      })
      .returning();

    return user;
  }

  /**
   * Retrieves a user by their Discord ID
   * Returns null if user is not found
   */
  static async getUserByDiscordId(discordId: string): Promise<DbUser | null> {
    const result = await db
      .select()
      .from(usersModel)
      .where(eq(usersModel.discordId, discordId))
      .limit(1);

    return result.at(0) ?? null;
  }

  /**
   * Updates an existing user's information
   */
  static async updateUserByDiscordId(
    discordId: string,
    data: Partial<DbNewUser>,
  ): Promise<DbUser> {
    const [updatedUser] = await db
      .update(usersModel)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(usersModel.discordId, discordId))
      .returning();

    return updatedUser;
  }
}
