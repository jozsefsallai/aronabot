ALTER TABLE "students" ADD COLUMN "base_variant_id" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "students" ADD CONSTRAINT "students_base_variant_id_students_id_fk" FOREIGN KEY ("base_variant_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
