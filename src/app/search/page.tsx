"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/clientApi";
import type { Food } from "@/lib/types";

export default function SearchPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [selected, setSelected] = useState<Food | null>(null);
  const [portion, setPortion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      api<Food[]>(`/api/foods?q=${encodeURIComponent(q)}`)
        .then(setResults)
        .catch(() => {});
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  function pick(food: Food) {
    setSelected(food);
    setPortion(Math.round(Number(food.servingSizeG)));
  }

  const ratio = selected ? portion / (Number(selected.servingSizeG) || 1) : 0;
  const scaled = selected
    ? {
        calories: Math.round(selected.calories * ratio),
        proteinG: Math.round(Number(selected.proteinG) * ratio),
        fatG: Math.round(Number(selected.fatG) * ratio),
        carbsG: Math.round(Number(selected.carbsG) * ratio),
      }
    : null;

  async function saveLog() {
    if (!selected || !scaled) return;
    setSaving(true);
    setError("");
    try {
      await api("/api/logs", {
        method: "POST",
        body: JSON.stringify({
          foodName: selected.name,
          portionG: portion,
          ...scaled,
          sourceType: "search",
          foodId: selected.id,
        }),
      });
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan catatan.");
      setSaving(false);
    }
  }

  return (
    <AppShell title="Cari Makanan">
      <div className="flex flex-col gap-4">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSelected(null);
          }}
          placeholder="Cari: nasi goreng, tempe, whey…"
          autoFocus
          className="glass w-full rounded-2xl px-5 py-3.5 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
        />

        {selected && scaled ? (
          <div className="glass flex flex-col gap-4 rounded-2xl p-5">
            <div>
              <h2 className="text-xl font-extrabold">{selected.name}</h2>
              <p className="text-xs text-muted">
                Per {Math.round(Number(selected.servingSizeG))}g: {selected.calories} kkal
              </p>
            </div>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted">Porsi (gram)</span>
              <input
                type="number"
                min={1}
                value={portion}
                onChange={(e) => setPortion(Math.max(1, Number(e.target.value)))}
                className="w-28 rounded-xl border border-white/10 bg-surface px-3 py-2 text-right font-bold focus:border-accent focus:outline-none"
              />
            </label>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="text-lg font-extrabold text-yellow">{scaled.calories}</p>
                <p className="text-[10px] text-muted">kkal</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="text-lg font-extrabold text-green">{scaled.proteinG}g</p>
                <p className="text-[10px] text-muted">protein</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="text-lg font-extrabold text-yellow">{scaled.fatG}g</p>
                <p className="text-[10px] text-muted">lemak</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-3">
                <p className="text-lg font-extrabold text-accent">{scaled.carbsG}g</p>
                <p className="text-[10px] text-muted">karbo</p>
              </div>
            </div>
            {error && <p className="text-sm text-red">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-muted"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveLog}
                disabled={saving}
                className="flex-1 rounded-xl bg-green py-3 font-bold text-background disabled:opacity-50"
              >
                {saving ? "Menyimpan…" : "✓ Catat"}
              </button>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {results.map((food) => (
              <li key={food.id}>
                <button
                  type="button"
                  onClick={() => pick(food)}
                  className="glass flex w-full items-center justify-between gap-3 rounded-2xl p-4 text-left transition hover:border-accent/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{food.name}</p>
                    <p className="text-xs text-muted">
                      {Math.round(Number(food.servingSizeG))}g · P{" "}
                      {Math.round(Number(food.proteinG))} · L {Math.round(Number(food.fatG))} · K{" "}
                      {Math.round(Number(food.carbsG))}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-yellow">
                    {food.calories}
                    <span className="text-xs font-normal text-muted"> kkal</span>
                  </p>
                </button>
              </li>
            ))}
            {results.length === 0 && q && (
              <p className="glass rounded-2xl p-5 text-center text-sm text-muted">
                Tidak ketemu &quot;{q}&quot;. Coba kata lain, atau scan fotonya saja.
              </p>
            )}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
