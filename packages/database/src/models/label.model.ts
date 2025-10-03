import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { eq, and } from "drizzle-orm";
import { db } from "../index";
import { projectModel } from "./project.model";

export const labelModel = pgTable("labels", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv7()),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectModel.id, { onDelete: "cascade" }),
  label: varchar("label").notNull(),
  description: text("description"),
  creatorId: uuid("creator_id").notNull(),
  color: varchar("color").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type DbLabel = typeof labelModel.$inferSelect;
export type DbNewLabel = typeof labelModel.$inferInsert;

// Label DAL 🟩

export class LabelDal {
  static async createLabel(input: DbNewLabel): Promise<DbLabel> {
    const [label] = await db.insert(labelModel).values(input).returning();

    return label;
  }

  static async getLabelById(id: string): Promise<DbLabel | null> {
    const result = await db
      .select()
      .from(labelModel)
      .where(eq(labelModel.id, id))
      .limit(1);

    return result.at(0) ?? null;
  }

  static async getLabelsByProjectId(projectId: string): Promise<DbLabel[]> {
    return await db
      .select()
      .from(labelModel)
      .where(eq(labelModel.projectId, projectId));
  }

  static async updateLabel(
    id: string,
    data: Partial<DbNewLabel>,
  ): Promise<DbLabel> {
    const [label] = await db
      .update(labelModel)
      .set(data)
      .where(eq(labelModel.id, id))
      .returning();

    return label;
  }

  static async deleteLabel(id: string): Promise<DbLabel> {
    const [label] = await db
      .delete(labelModel)
      .where(eq(labelModel.id, id))
      .returning();

    return label;
  }
}
