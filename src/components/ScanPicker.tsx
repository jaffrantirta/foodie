"use client";

import { useRef } from "react";
import { Camera, Images, X } from "lucide-react";
import { fileToDataUrl } from "@/lib/clientApi";

/**
 * Bottom sheet pilihan sumber foto: kamera langsung atau galeri.
 * Dua input file terpisah — `capture` memaksa kamera, tanpa `capture` membuka galeri.
 */
export function ScanPicker({
  open,
  onClose,
  onImage,
}: {
  open: boolean;
  onClose: () => void;
  onImage: (dataUrl: string) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  async function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    onImage(await fileToDataUrl(file));
    onClose();
  }

  return (
    <>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePick}
        className="hidden"
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={handlePick}
        className="hidden"
      />

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
          onClick={onClose}
        >
          <div
            className="glass w-full max-w-md rounded-t-3xl p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold">Scan Makanan</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="text-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="flex items-center gap-3 rounded-2xl bg-accent px-4 py-3.5 font-bold text-background"
              >
                <Camera size={20} />
                Ambil Foto
              </button>
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-surface px-4 py-3.5 font-semibold"
              >
                <Images size={20} />
                Pilih dari Galeri
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
