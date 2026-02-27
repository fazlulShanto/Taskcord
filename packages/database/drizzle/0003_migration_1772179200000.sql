ALTER TABLE "tasks" ADD COLUMN "milestone_id" uuid;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "assignees" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "labels" ADD COLUMN "is_status" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "labels" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_milestone_id_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."milestones"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
DROP TABLE IF EXISTS "milestone_tasks";--> statement-breakpoint
DROP TABLE IF EXISTS "task_assignees";--> statement-breakpoint
DROP TABLE IF EXISTS "statuses";
