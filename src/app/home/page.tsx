"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Search, Target, UtensilsCrossed, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ScanPicker } from "@/components/ScanPicker";
import { api, PENDING_SCAN_KEY } from "@/lib/clientApi";
import type { FoodLog, Summary } from "@/lib/types";

const GOAL_LABELS: Record<string, string> = {
  diet: "Diet (defisit)",
  bulking: "Bulking (surplus)",
  maintain: "Maintain",
};

function MacroBar({
  label,
  value,
  target,
  color,
}: {
  label: string;
  value: number;
  target: number | null;
  color: string;
}) {
  const pct = target ? Math.min(100, (value / target) * 100) : 0;
  const over = target !== null && value > target;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className={over ? "font-bold text-red" : "text-foreground"}>
          {Math.round(value)}
          {target ? ` / ${target}` : ""} g
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: over ? "var(--red)" : color }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Foto dipilih langsung dari Home → simpan sementara → halaman Scan auto-analisis.
  function onScanImage(dataUrl: string) {
    sessionStorage.setItem(PENDING_SCAN_KEY, dataUrl);
    router.push("/scan");
  }

  const refresh = useCallback(() => {
    api<Summary>("/api/summary").then(setSummary).catch(() => {});
    api<FoodLog[]>("/api/logs").then(setLogs).catch(() => {});
  }, []);

  useEffect(refresh, [refresh]);

  async function removeLog(id: string) {
    await api(`/api/logs/${id}`, { method: "DELETE" });
    refresh();
  }

  const totals = summary?.totals;
  const goal = summary?.goal ?? null;
  const calPct = goal && totals ? Math.min(100, (totals.calories / goal.targetCalories) * 100) : 0;
  const calOver = goal && totals ? totals.calories > goal.targetCalories : false;

  return (
    <AppShell title="Hari Ini">
      <ScanPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onImage={onScanImage}
      />

      {/* Kartu kalori */}
      <section className="glass rounded-2xl p-5">
        {goal && totals ? (
          <>
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-muted">
                Kalori · {GOAL_LABELS[goal.goalType] ?? goal.goalType}
              </p>
              <p className="text-xs text-muted">{summary?.date}</p>
            </div>
            <p className="mt-1">
              <span className={`text-4xl font-extrabold ${calOver ? "text-red" : "text-yellow"}`}>
                {Math.round(totals.calories)}
              </span>
              <span className="text-muted"> / {goal.targetCalories} kkal</span>
            </p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${calPct}%`,
                  background: calOver ? "var(--red)" : "var(--yellow)",
                }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              {calOver
                ? `Lebih ${Math.round(totals.calories - goal.targetCalories)} kkal dari target`
                : `Sisa ${Math.round(goal.targetCalories - totals.calories)} kkal lagi`}
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <MacroBar label="Protein" value={totals.proteinG} target={goal.targetProteinG} color="var(--green)" />
              <MacroBar label="Lemak" value={totals.fatG} target={goal.targetFatG} color="var(--yellow)" />
              <MacroBar label="Karbohidrat" value={totals.carbsG} target={goal.targetCarbsG} color="var(--accent)" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <Target size={36} className="text-accent" aria-hidden />
            <p className="text-sm text-muted">
              Belum ada target nutrisi. Atur tujuanmu (diet/bulking) untuk mulai
              melacak.
            </p>
            <Link
              href="/goals"
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-background"
            >
              Atur Target
            </Link>
          </div>
        )}
      </section>

      {/* Aksi cepat */}
      <section className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="glass flex flex-col items-center gap-1.5 rounded-2xl py-5 transition hover:border-accent/40"
        >
          <Camera size={26} className="text-accent" aria-hidden />
          <span className="text-sm font-bold">Scan Makanan</span>
          <span className="text-xs text-muted">Kamera atau galeri</span>
        </button>
        <Link
          href="/search"
          className="glass flex flex-col items-center gap-1.5 rounded-2xl py-5 transition hover:border-accent/40"
        >
          <Search size={26} className="text-accent" aria-hidden />
          <span className="text-sm font-bold">Cari Makanan</span>
          <span className="text-xs text-muted">Database lokal ID</span>
        </Link>
      </section>

      {/* Log hari ini */}
      <section className="mt-4">
        <h2 className="mb-2 px-1 text-sm font-bold text-muted">
          Catatan hari ini ({logs.length})
        </h2>
        {logs.length === 0 ? (
          <p className="glass rounded-2xl p-5 text-center text-sm text-muted">
            Belum ada makanan tercatat. Scan atau cari makananmu!
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {logs.map((log) => (
              <li key={log.id} className="glass flex items-center gap-3 rounded-2xl p-4">
                <span className="text-muted" aria-hidden>
                  {log.sourceType === "scan" ? (
                    <Camera size={20} />
                  ) : (
                    <UtensilsCrossed size={20} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{log.foodName}</p>
                  <p className="text-xs text-muted">
                    {Math.round(Number(log.portionG))}g · P {Math.round(Number(log.proteinG))} · L{" "}
                    {Math.round(Number(log.fatG))} · K {Math.round(Number(log.carbsG))}
                  </p>
                </div>
                <p className="text-sm font-bold text-yellow">
                  {Math.round(Number(log.calories))}
                  <span className="text-xs font-normal text-muted"> kkal</span>
                </p>
                <button
                  type="button"
                  onClick={() => removeLog(log.id)}
                  aria-label={`Hapus ${log.foodName}`}
                  className="text-muted hover:text-red"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
