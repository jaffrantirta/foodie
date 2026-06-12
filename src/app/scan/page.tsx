"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ScanPicker } from "@/components/ScanPicker";
import { api, PENDING_SCAN_KEY } from "@/lib/clientApi";
import type { Scan } from "@/lib/types";

export default function ScanPage() {
  const router = useRouter();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [scan, setScan] = useState<Scan | null>(null);
  const [portion, setPortion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const analyze = useCallback(async (dataUrl: string) => {
    setLoading(true);
    setError("");
    setScan(null);
    try {
      const result = await api<Scan>("/api/scan", {
        method: "POST",
        body: JSON.stringify({ imageDataUrl: dataUrl }),
      });
      setScan(result);
      setPortion(Math.round(Number(result.estimatedServingSizeG)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menganalisis foto.");
    } finally {
      setLoading(false);
    }
  }, []);

  function onImage(dataUrl: string) {
    setImage(dataUrl);
    analyze(dataUrl);
  }

  // Foto yang dipilih dari Home dikirim lewat sessionStorage, lalu langsung dianalisis.
  useEffect(() => {
    const pending = sessionStorage.getItem(PENDING_SCAN_KEY);
    if (!pending) return;
    sessionStorage.removeItem(PENDING_SCAN_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- handoff satu kali dari halaman Home
    setImage(pending);
    analyze(pending);
  }, [analyze]);

  // Skala nutrisi mengikuti porsi yang disesuaikan user.
  const ratio = scan ? portion / (Number(scan.estimatedServingSizeG) || 1) : 0;
  const scaled = scan
    ? {
        calories: Math.round(scan.estimatedCalories * ratio),
        proteinG: Math.round(Number(scan.estimatedProteinG) * ratio),
        fatG: Math.round(Number(scan.estimatedFatG) * ratio),
        carbsG: Math.round(Number(scan.estimatedCarbsG) * ratio),
      }
    : null;

  async function saveLog() {
    if (!scan || !scaled) return;
    setSaving(true);
    setError("");
    try {
      await api("/api/logs", {
        method: "POST",
        body: JSON.stringify({
          foodName: scan.detectedFoodName,
          portionG: portion,
          ...scaled,
          sourceType: "scan",
          scanId: scan.id,
        }),
      });
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan catatan.");
      setSaving(false);
    }
  }

  const confidence = scan?.confidenceData?.confidence;

  return (
    <AppShell title="Scan Makanan">
      <ScanPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onImage={onImage}
      />

      <div className="flex flex-col gap-4">
        {!image && (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="glass flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/15 py-16"
          >
            <Camera size={48} className="text-accent" />
            <span className="font-bold">Foto makananmu</span>
            <span className="text-sm text-muted">
              Ambil foto langsung atau pilih dari galeri
            </span>
          </button>
        )}

        {image && (
          <div className="glass overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element -- preview data URL lokal */}
            <img src={image} alt="Foto makanan" className="max-h-72 w-full object-cover" />
            <div className="flex gap-2 p-3">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-muted"
              >
                Ganti foto
              </button>
              {!scan && !loading && (
                <button
                  type="button"
                  onClick={() => analyze(image)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-bold text-background"
                >
                  <Sparkles size={16} />
                  Analisis Nutrisi
                </button>
              )}
              {loading && (
                <span className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent/50 py-2.5 text-sm font-bold text-background">
                  <Sparkles size={16} className="animate-pulse" />
                  Menganalisis…
                </span>
              )}
            </div>
          </div>
        )}

        {error && <p className="text-center text-sm text-red">{error}</p>}

        {scan && scaled && (
          <div className="glass flex flex-col gap-4 rounded-2xl p-5">
            <div>
              <p className="text-xs text-muted">
                Terdeteksi{confidence ? ` · yakin ${Math.round(confidence * 100)}%` : ""}
              </p>
              <h2 className="text-xl font-extrabold">{scan.detectedFoodName}</h2>
              {scan.confidenceData?.notes && (
                <p className="mt-1 text-xs text-muted">{scan.confidenceData.notes}</p>
              )}
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

            <button
              type="button"
              onClick={saveLog}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-green py-3 font-bold text-background disabled:opacity-50"
            >
              <Check size={18} />
              {saving ? "Menyimpan…" : "Catat ke Hari Ini"}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
