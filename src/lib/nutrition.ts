export type GoalType = "diet" | "bulking" | "maintain";
export type Gender = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Jarang olahraga",
  light: "Olahraga ringan 1-3x/minggu",
  moderate: "Olahraga sedang 3-5x/minggu",
  active: "Olahraga berat 6-7x/minggu",
  very_active: "Sangat aktif / atlet",
};

export type NutritionTargets = {
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
};

/**
 * Rekomendasi target nutrisi harian berdasarkan tujuan tubuh.
 * BMR memakai rumus Mifflin-St Jeor, dikali faktor aktivitas (TDEE),
 * lalu disesuaikan: diet -20%, bulking +12%.
 * Makro: protein 1.6-2.2 g/kg, lemak 25% kalori, sisanya karbohidrat.
 */
export function recommendTargets(input: {
  goalType: GoalType;
  gender: Gender;
  weightKg: number;
  heightCm: number;
  age: number;
  activityLevel: ActivityLevel;
}): NutritionTargets {
  const { goalType, gender, weightKg, heightCm, age, activityLevel } = input;

  const bmr =
    10 * weightKg + 6.25 * heightCm - 5 * age + (gender === "male" ? 5 : -161);
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];

  const calories = Math.round(
    goalType === "diet" ? tdee * 0.8 : goalType === "bulking" ? tdee * 1.12 : tdee
  );

  const proteinPerKg = goalType === "bulking" ? 2.0 : goalType === "diet" ? 2.2 : 1.6;
  const proteinG = Math.round(weightKg * proteinPerKg);
  const fatG = Math.round((calories * 0.25) / 9);
  const carbsG = Math.max(0, Math.round((calories - proteinG * 4 - fatG * 9) / 4));

  return { calories, proteinG, fatG, carbsG };
}
