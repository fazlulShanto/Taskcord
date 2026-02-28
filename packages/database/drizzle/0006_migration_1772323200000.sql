CREATE TABLE IF NOT EXISTS "project_invites" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid NOT NULL,
	"inviter_id" uuid NOT NULL,
	"role_id" uuid,
	"token_hash" varchar(128) NOT NULL,
	"invite_type" varchar(32) DEFAULT 'single_use' NOT NULL,
	"restriction_type" varchar(32) DEFAULT 'none' NOT NULL,
	"restricted_email" varchar(255),
	"restricted_discord_id" varchar(64),
	"max_uses" integer DEFAULT 1 NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp,
	"last_accepted_at" timestamp,
	"last_accepted_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "project_invites_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_invites" ADD CONSTRAINT "project_invites_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_invites" ADD CONSTRAINT "project_invites_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_invites" ADD CONSTRAINT "project_invites_role_id_project_defined_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."project_defined_roles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_invites" ADD CONSTRAINT "project_invites_last_accepted_by_users_id_fk" FOREIGN KEY ("last_accepted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_invites_project_id_idx" ON "project_invites" USING btree ("project_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_invites_expires_at_idx" ON "project_invites" USING btree ("expires_at");
