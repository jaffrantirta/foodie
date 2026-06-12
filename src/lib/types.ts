// Tipe respons API. Kolom decimal Postgres dikembalikan sebagai string oleh pg.
export type Goal = {
  id: string;
  goalType: "diet" | "bulking" | "maintain";
  gender: "male" | "female";
  targetCalories: number;
  targetProteinG: number;
  targetFatG: number;
  targetCarbsG: number;
  weightKg: string;
  heightCm: string;
  age: number;
  activityLevel: string;
};

export type Summary = {
  date: string;
  totals: {
    calories: number;
    proteinG: number;
    fatG: number;
    carbsG: number;
    entries: number;
  };
  goal: Goal | null;
  remaining: {
    calories: number;
    proteinG: number;
    fatG: number;
    carbsG: number;
  } | null;
};

export type FoodLog = {
  id: string;
  foodName: string;
  sourceType: "search" | "scan" | "manual";
  portionG: string;
  calories: string;
  proteinG: string;
  fatG: string;
  carbsG: string;
  consumedAt: string;
};

export type Food = {
  id: string;
  name: string;
  brandName: string | null;
  servingSizeG: string;
  calories: number;
  proteinG: string;
  fatG: string;
  carbsG: string;
};

export type Scan = {
  id: string;
  detectedFoodName: string;
  estimatedServingSizeG: string;
  estimatedCalories: number;
  estimatedProteinG: string;
  estimatedFatG: string;
  estimatedCarbsG: string;
  confidenceData: { confidence: number | null; notes: string | null } | null;
};
