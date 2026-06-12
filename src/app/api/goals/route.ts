import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { bodyGoals } from "@/db/schema";
import { getSession } from "@/lib/auth";
import {
  recommendTargets,
  type ActivityLevel,
  type Gender,
  type GoalType,
} from "@/lib/nutrition";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  const [goal] = await db
    .select()
    .from(bodyGoals)
    .where(and(eq(bodyGoals.userId, session.userId), eq(bodyGoals.isActive, true)))
    .limit(1);

  return NextResponse.json(goal ?? null);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Belum login." }, { status: 401 });

  let body: {
    goalType?: GoalType;
    gender?: Gender;
    weightKg?: number;
    heightCm?: number;
    age?: number;
    activityLevel?: ActivityLevel;
    // Override manual target (opsional) — jika kosong, dihitung dari rumus.
    targetCalories?: number;
    targetProteinG?: number;
    targetFatG?: number;
    targetCarbsG?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const { goalType, gender, weightKg, heightCm, age, activityLevel } = body;
  if (
    !goalType ||
    !gender ||
    !weightKg ||
    !heightCm ||
    !age ||
    !activityLevel ||
    weightKg <= 0 ||
    heightCm <= 0 ||
    age <= 0
  ) {
    return NextResponse.json(
      { error: "Lengkapi tujuan, gender, berat, tinggi, umur, dan level aktivitas." },
      { status: 400 }
    );
  }

  const recommended = recommendTargets({
    goalType,
    gender,
    weightKg,
    heightCm,
    age,
    activityLevel,
  });

  // Nonaktifkan goal lama, lalu buat goal baru sebagai yang aktif.
  await db
    .update(bodyGoals)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(bodyGoals.userId, session.userId));

  const [goal] = await db
    .insert(bodyGoals)
    .values({
      userId: session.userId,
      goalType,
      gender,
      weightKg: String(weightKg),
      heightCm: String(heightCm),
      age,
      activityLevel,
      targetCalories: body.targetCalories ?? recommended.calories,
      targetProteinG: body.targetProteinG ?? recommended.proteinG,
      targetFatG: body.targetFatG ?? recommended.fatG,
      targetCarbsG: body.targetCarbsG ?? recommended.carbsG,
      isActive: true,
    })
    .returning();

  return NextResponse.json(goal, { status: 201 });
}
