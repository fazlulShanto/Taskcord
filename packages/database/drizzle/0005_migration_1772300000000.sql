CREATE INDEX IF NOT EXISTS "project_roles_user_id_idx" ON "project_roles" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_defined_roles_project_id_idx" ON "project_defined_roles" USING btree ("project_id");
