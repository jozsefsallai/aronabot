DO $$ BEGIN
 CREATE TYPE "attack_type" AS ENUM('explosive', 'piercing', 'mystic', 'sonic');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "banner_kind" AS ENUM('global', 'jp', 'chroma');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "combat_class" AS ENUM('striker', 'special');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "combat_position" AS ENUM('front', 'middle', 'back');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "combat_role" AS ENUM('attacker', 'healer', 'support', 't.s.', 'tank');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "defense_type" AS ENUM('light', 'heavy', 'special', 'elastic');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "difficulty" AS ENUM('normal', 'hard', 'veryhard', 'hardcode', 'extreme', 'insane', 'torment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "school" AS ENUM('abydos', 'arius', 'gehenna', 'hyakkiyako', 'millennium', 'redwinter', 'shanhaijing', 'srt', 'trinity', 'valkyrie', 'tokiwadai', 'sakugawa', 'etc');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "skill_type" AS ENUM('ex', 'basic', 'enhanced', 'sub');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "terrain" AS ENUM('indoors', 'outdoors', 'urban');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "weapon_type" AS ENUM('AR', 'FT', 'GL', 'HG', 'MG', 'MT', 'RG', 'RL', 'SG', 'SMG', 'SR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "banners" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"date" date NOT NULL,
	"three_star_rate" integer DEFAULT 3 NOT NULL,
	"pickup_rate" integer DEFAULT 0 NOT NULL,
	"extra_rate" integer DEFAULT 0 NOT NULL,
	"pickup_pool_students" varchar[],
	"extra_pool_students" varchar[],
	"additional_three_star_students" varchar[],
	"base_one_star_rate" integer DEFAULT 785 NOT NULL,
	"base_two_star_rate" integer DEFAULT 185 NOT NULL,
	"base_three_star_rate" integer DEFAULT 30 NOT NULL,
	"kind" "banner_kind" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "favorite_gifts_to_students" (
	"student_id" varchar NOT NULL,
	"gift_id" integer NOT NULL,
	CONSTRAINT "favorite_gifts_to_students_student_id_gift_id_pk" PRIMARY KEY("student_id","gift_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gifts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"icon_url" text,
	"description" text,
	"rarity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "liked_gifts_to_students" (
	"student_id" varchar NOT NULL,
	"gift_id" integer NOT NULL,
	CONSTRAINT "liked_gifts_to_students_student_id_gift_id_pk" PRIMARY KEY("student_id","gift_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "missions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"cost" integer NOT NULL,
	"difficulty" "difficulty",
	"terrain" "terrain",
	"recommended_level" integer NOT NULL,
	"drops" text[] NOT NULL,
	"stage_image_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" varchar NOT NULL,
	"kind" "skill_type" NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"cost" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"full_name" varchar NOT NULL,
	"school" "school" NOT NULL,
	"age" varchar NOT NULL,
	"birthday" varchar NOT NULL,
	"height" varchar NOT NULL,
	"hobbies" text,
	"wiki_image" text,
	"attack_type" "attack_type",
	"defense_type" "defense_type",
	"combat_class" "combat_class",
	"combat_role" "combat_role",
	"combat_position" "combat_position",
	"uses_cover" boolean DEFAULT false NOT NULL,
	"weapon_type" "weapon_type",
	"rarity" integer NOT NULL,
	"is_welfare" boolean DEFAULT false NOT NULL,
	"is_limited" boolean DEFAULT false NOT NULL,
	"release_date" date
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorite_gifts_to_students" ADD CONSTRAINT "favorite_gifts_to_students_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorite_gifts_to_students" ADD CONSTRAINT "favorite_gifts_to_students_gift_id_gifts_id_fk" FOREIGN KEY ("gift_id") REFERENCES "gifts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liked_gifts_to_students" ADD CONSTRAINT "liked_gifts_to_students_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liked_gifts_to_students" ADD CONSTRAINT "liked_gifts_to_students_gift_id_gifts_id_fk" FOREIGN KEY ("gift_id") REFERENCES "gifts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skills" ADD CONSTRAINT "skills_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
