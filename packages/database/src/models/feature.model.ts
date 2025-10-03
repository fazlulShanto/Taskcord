import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const featureModel = pgTable("features", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv7()),
  featureSlug: varchar("feature_slug").notNull().unique(),
  featureName: varchar("feature_name").notNull(),
});

export type DbFeature = typeof featureModel.$inferSelect;
export type DbNewFeature = typeof featureModel.$inferInsert;

/* eslint-disable @typescript-eslint/no-extraneous-class -- This is a DAL class */
import { eq } from "drizzle-orm";
import { db } from "../index";

export class FeatureDal {
  static async createFeature(input: DbNewFeature): Promise<DbFeature> {
    const [feature] = await db.insert(featureModel).values(input).returning();

    return feature;
  }

  static async getFeatureById(id: string): Promise<DbFeature | null> {
    const result = await db
      .select()
      .from(featureModel)
      .where(eq(featureModel.id, id))
      .limit(1);

    return result.at(0) ?? null;
  }

  static async getFeatureBySlug(slug: string): Promise<DbFeature | null> {
    const result = await db
      .select()
      .from(featureModel)
      .where(eq(featureModel.featureSlug, slug))
      .limit(1);

    return result.at(0) ?? null;
  }

  static async getAllFeatures(): Promise<DbFeature[]> {
    return await db.select().from(featureModel);
  }

  static async updateFeature(
    id: string,
    data: Partial<DbNewFeature>,
  ): Promise<DbFeature> {
    const [updatedFeature] = await db
      .update(featureModel)
      .set(data)
      .where(eq(featureModel.id, id))
      .returning();

    return updatedFeature;
  }

  static async deleteFeature(id: string): Promise<DbFeature> {
    const [deletedFeature] = await db
      .delete(featureModel)
      .where(eq(featureModel.id, id))
      .returning();

    return deletedFeature;
  }
}
