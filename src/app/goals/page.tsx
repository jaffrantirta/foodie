"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, Flame, Scale, Sparkles, type LucideIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/clientApi";
import {
  ACTIVITY_LABELS,
  recommendTargets,
  type ActivityLevel,
  type Gender,
  type GoalType,
} from "@/lib/nutrition";
import type { Goal } from "@/lib/types";

const GOAL_OPTIONS: { value: GoalType; label: string; desc: string; Icon: LucideIcon }[] = [
  { value: "diet", label: "Diet", desc: "Defisit kalori −20%", Icon: Flame },
  { value: "bulking", label: "Bulking", desc: "Surplus kalori +12%", Icon: Dumbbell },
  { value: "maintain", label: "Maintain", desc: "Pertahankan berat", Icon: Scale },
];

export default function GoalsPage() {
  const router = useRouter();
  const [goalType, setGoalType] = useState<GoalType>("diet");
  const [gender, setGender] = useState<Gender>("male");
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(170);
  const [age, setAge] = useState(25);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("light");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Prefill dari goal aktif jika ada.
  useEffect(() => {
    api<Goal | null>("/api/goals")
      .then((goal) => {
        if (!goal) return;
        setGoalType(goal.goalType);
        setGender(goal.gender);
        setWeightKg(Number(goal.weightKg));
        setHeightCm(Number(goal.heightCm));
        setAge(goal.age);
        setActivityLevel(goal.activityLevel as ActivityLevel);
      })
      .catch(() => {});
  }, []);

  // Rekomendasi target dihitung live dengan rumus Mifflin-St Jeor.
  const targets = useMemo(
    () =>
      weightKg > 0 && heightCm > 0 && age > 0
        ? recommendTargets({ goalType, gender, weightKg, heightCm, age, activityLevel })
        : null,
    [goalType, gender, weightKg, heightCm, age, activityLevel]
  );

  async function save() {
    setSaving(true);
    setError("");
    try {
      await api("/api/goals", {
        method: "POST",
        body: JSON.stringify({ goalType, gender, weightKg, heightCm, age, activityLevel }),
      });
      router.push("/home");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan target.");
      setSaving(false);
    }
  }

  const numInputCls =
    "w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-center font-bold focus:border-accent focus:outline-none";

  return (
    <AppShell title="Target Nutrisi">
      <div className="flex flex-col gap-4">
        {/* Tujuan */}
        <section className="glass rounded-2xl p-4">
          <p className="mb-2 text-sm font-bold text-muted">Tujuan tubuh</p>
          <div className="grid grid-cols-3 gap-2">
            {GOAL_OPTIONS.map(({ value, label, desc, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setGoalType(value)}
                className={`flex flex-col items-center rounded-xl border p-3 text-center transition ${
                  goalType === value
                    ? "border-accent bg-accent/15"
                    : "border-white/10 bg-surface"
                }`}
              >
                <Icon
                  size={18}
                  className={goalType === value ? "text-accent" : "text-muted"}
                  aria-hidden
                />
                <p className="mt-1 text-sm font-bold">{label}</p>
                <p className="mt-0.5 text-[10px] text-muted">{desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Data tubuh */}
        <section className="glass flex flex-col gap-3 rounded-2xl p-4">
          <p className="text-sm font-bold text-muted">Data tubuh</p>
          <div className="grid grid-cols-2 gap-2">
            {(["male", "female"] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                  gender === g ? "border-accent bg-accent/15" : "border-white/10 bg-surface"
                }`}
              >
                {g === "male" ? "Pria" : "Wanita"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <label className="flex flex-col gap-1 text-xs text-muted">
              Berat (kg)
              <input type="number" min={20} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} className={numInputCls} />
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted">
              Tinggi (cm)
              <input type="number" min={100} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className={numInputCls} />
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted">
              Umur
              <input type="number" min={10} value={age} onChange={(e) => setAge(Number(e.target.value))} className={numInputCls} />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs text-muted">
            Level aktivitas
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              className="rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm font-semibold text-foreground focus:border-accent focus:outline-none"
            >
              {Object.entries(ACTIVITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </section>

        {/* Rekomendasi */}
        {targets && (
          <section className="glass rounded-2xl p-4">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-muted">
              <Sparkles size={14} className="text-accent" aria-hidden />
              Rekomendasi target harianmu
            </p>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="text-lg font-extrabold text-yellow">{targets.calories}</p>
                <p className="text-[10px] text-muted">kkal</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="text-lg font-extrabold text-green">{targets.proteinG}g</p>
                <p className="text-[10px] text-muted">protein</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="text-lg font-extrabold text-yellow">{targets.fatG}g</p>
                <p className="text-[10px] text-muted">lemak</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="text-lg font-extrabold text-accent">{targets.carbsG}g</p>
                <p className="text-[10px] text-muted">karbo</p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-muted">
              Dihitung dengan rumus Mifflin-St Jeor × aktivitas, disesuaikan tujuan{" "}
              {goalType}.
            </p>
          </section>
        )}

        {error && <p className="text-center text-sm text-red">{error}</p>}

        <button
          type="button"
          onClick={save}
          disabled={saving || !targets}
          className="rounded-xl bg-accent py-3.5 font-bold text-background disabled:opacity-50"
        >
          {saving ? "Menyimpan…" : "Simpan Target"}
        </button>
      </div>
    </AppShell>
  );
}
