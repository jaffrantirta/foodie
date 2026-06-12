import {
  pgTable,
  uuid,
  text,
  integer,
  decimal,
  boolean,
  jsonb,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

const tsOpts = { withTimezone: true } as const;

// Auth memakai username + password (keputusan product, menggantikan email di draft PRD).
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at", tsOpts).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", tsOpts).defaultNow().notNull(),
});

export const bodyGoals = pgTable("body_goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  goalType: text("goal_type").notNull(), // "diet" | "bulking" | "maintain"
  targetCalories: integer("target_calories").notNull(),
  targetProteinG: integer("target_protein_g").notNull(),
  targetFatG: integer("target_fat_g").notNull(),
  targetCarbsG: integer("target_carbs_g").notNull(),
  weightKg: decimal("weight_kg", { precision: 5, scale: 1 }).notNull(),
  heightCm: decimal("height_cm", { precision: 5, scale: 1 }).notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull().default("male"), // dibutuhkan rumus Mifflin-St Jeor
  activityLevel: text("activity_level").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", tsOpts).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", tsOpts).defaultNow().notNull(),
});

export const foods = pgTable("foods", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  brandName: text("brand_name"),
  servingSizeG: decimal("serving_size_g", { precision: 7, scale: 1 }).notNull(),
  calories: integer("calories").notNull(),
  proteinG: decimal("protein_g", { precision: 6, scale: 1 }).notNull(),
  fatG: decimal("fat_g", { precision: 6, scale: 1 }).notNull(),
  carbsG: decimal("carbs_g", { precision: 6, scale: 1 }).notNull(),
  aliases: jsonb("aliases").$type<string[]>(),
  createdAt: timestamp("created_at", tsOpts).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", tsOpts).defaultNow().notNull(),
});

export const foodScans = pgTable("food_scans", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  imageUrl: text("image_url"),
  detectedFoodName: text("detected_food_name").notNull(),
  estimatedServingSizeG: decimal("estimated_serving_size_g", {
    precision: 7,
    scale: 1,
  }).notNull(),
  estimatedCalories: integer("estimated_calories").notNull(),
  estimatedProteinG: decimal("estimated_protein_g", { precision: 6, scale: 1 }).notNull(),
  estimatedFatG: decimal("estimated_fat_g", { precision: 6, scale: 1 }).notNull(),
  estimatedCarbsG: decimal("estimated_carbs_g", { precision: 6, scale: 1 }).notNull(),
  confidenceData: jsonb("confidence_data"),
  createdAt: timestamp("created_at", tsOpts).defaultNow().notNull(),
});

export const foodLogs = pgTable("food_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  foodId: uuid("food_id").references(() => foods.id, { onDelete: "set null" }),
  scanId: uuid("scan_id").references(() => foodScans.id, { onDelete: "set null" }),
  sourceType: text("source_type").notNull(), // "search" | "scan" | "manual"
  foodName: text("food_name").notNull(),
  portionG: decimal("portion_g", { precision: 7, scale: 1 }).notNull(),
  calories: decimal("calories", { precision: 7, scale: 1 }).notNull(),
  proteinG: decimal("protein_g", { precision: 6, scale: 1 }).notNull(),
  fatG: decimal("fat_g", { precision: 6, scale: 1 }).notNull(),
  carbsG: decimal("carbs_g", { precision: 6, scale: 1 }).notNull(),
  consumedAt: timestamp("consumed_at", tsOpts).defaultNow().notNull(),
  createdAt: timestamp("created_at", tsOpts).defaultNow().notNull(),
});

// Ringkasan harian dihitung on-the-fly di API; tabel disediakan sesuai PRD
// untuk kebutuhan caching/reporting ke depan.
export const dailyNutritionSummary = pgTable("daily_nutrition_summary", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bodyGoalId: uuid("body_goal_id").references(() => bodyGoals.id, {
    onDelete: "set null",
  }),
  logDate: date("log_date").notNull(),
  totalCalories: integer("total_calories").notNull().default(0),
  totalProteinG: decimal("total_protein_g", { precision: 7, scale: 1 }).notNull().default("0"),
  totalFatG: decimal("total_fat_g", { precision: 7, scale: 1 }).notNull().default("0"),
  totalCarbsG: decimal("total_carbs_g", { precision: 7, scale: 1 }).notNull().default("0"),
  remainingCalories: integer("remaining_calories").notNull().default(0),
  remainingProteinG: decimal("remaining_protein_g", { precision: 7, scale: 1 }).notNull().default("0"),
  remainingFatG: decimal("remaining_fat_g", { precision: 7, scale: 1 }).notNull().default("0"),
  remainingCarbsG: decimal("remaining_carbs_g", { precision: 7, scale: 1 }).notNull().default("0"),
  createdAt: timestamp("created_at", tsOpts).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", tsOpts).defaultNow().notNull(),
});
