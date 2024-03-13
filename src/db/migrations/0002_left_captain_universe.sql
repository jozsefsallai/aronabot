DROP TABLE "favorite_gifts_to_students";--> statement-breakpoint
DROP TABLE "liked_gifts_to_students";--> statement-breakpoint
ALTER TABLE "gifts" ADD COLUMN "students_favorite" varchar[];--> statement-breakpoint
ALTER TABLE "gifts" ADD COLUMN "students_liked" varchar[];