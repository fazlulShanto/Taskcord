CREATE TABLE "project_user_roles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now(),
	CONSTRAINT "project_user_roles_user_id_role_id_project_id_unique" UNIQUE("user_id","role_id","project_id")
);
--> statement-breakpoint
CREATE TABLE "statuses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"creator_id" uuid NOT NULL,
	"color" varchar NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "project_defined_roles" DROP CONSTRAINT "project_defined_roles_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "project_defined_roles" ADD COLUMN "description" varchar(255);--> statement-breakpoint
ALTER TABLE "project_defined_roles" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "project_defined_roles" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "project_defined_roles" ADD COLUMN "permission_code" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "project_defined_roles" ADD COLUMN "creator_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "project_user_roles" ADD CONSTRAINT "project_user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_user_roles" ADD CONSTRAINT "project_user_roles_role_id_project_defined_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."project_defined_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_user_roles" ADD CONSTRAINT "project_user_roles_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statuses" ADD CONSTRAINT "statuses_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_defined_roles" ADD CONSTRAINT "project_defined_roles_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_defined_roles" ADD CONSTRAINT "project_defined_roles_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;