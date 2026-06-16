import Link from "next/link";
import {
  Camera,
  Search,
  BarChart3,
  Sparkles,
  ChevronRight,
  Zap,
  ShieldCheck,
  Apple,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    color: "text-accent",
    bg: "bg-accent/10",
    title: "scan foto makanan",
    desc: "foto makananmu, AI langsung kenali dan estimasi kalori serta makro nutrisi dalam hitungan detik.",
  },
  {
    icon: Search,
    color: "text-green",
    bg: "bg-green/10",
    title: "cari database makanan",
    desc: "ribuan makanan indonesia tersedia — dari nasi goreng, rendang, sampai whey protein.",
  },
  {
    icon: BarChart3,
    color: "text-yellow",
    bg: "bg-yellow/10",
    title: "lacak progress harian",
    desc: "pantau kalori, protein, lemak, dan karbo. sesuaikan porsi, catat ke tanggal manapun.",
  },
];

const steps = [
  { num: "01", title: "foto makananmu", desc: "ambil foto langsung dari kamera atau pilih dari galeri." },
  { num: "02", title: "AI analisis nutrisi", desc: "model AI canggih mengenali makanan dan mengestimasi kandungan gizinya." },
  { num: "03", title: "sesuaikan & catat", desc: "atur porsi sesuai realita, lalu simpan ke log harianmu." },
  { num: "04", title: "pantau target", desc: "lihat progres kalori dan makro terhadap target diet atau bulking-mu." },
];

const macros = [
  { label: "kalori", value: "650", unit: "kkal", color: "text-yellow" },
  { label: "protein", value: "18g", unit: "", color: "text-green" },
  { label: "lemak", value: "20g", unit: "", color: "text-yellow" },
  { label: "karbo", value: "98g", unit: "", color: "text-accent" },
];

const goals = [
  { type: "diet", emoji: "🔥", desc: "defisit kalori untuk turun berat badan" },
  { type: "bulking", emoji: "💪", desc: "surplus kalori untuk bangun massa otot" },
  { type: "maintain", emoji: "⚖️", desc: "jaga berat badan ideal yang sudah tercapai" },
];

const trustItems = [
  { icon: Zap, label: "analisis instan", desc: "hasil nutrisi dalam < 5 detik" },
  { icon: ShieldCheck, label: "privasi terjaga", desc: "foto tidak disimpan di server" },
  { icon: Apple, label: "cocok semua tujuan", desc: "diet, bulking, atau maintain" },
];

export default function LandingPage() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-md">
      {/* ── nav ── */}
      <nav className="sticky top-0 z-10 glass flex items-center justify-between px-5 py-4">
        <span className="text-lg font-extrabold tracking-tight">
          foodie<span className="text-accent">.</span>
        </span>
        <div className="flex gap-2">
          <Link
            href="/login"
            className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-muted hover:text-foreground"
          >
            masuk
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-background"
          >
            daftar gratis
          </Link>
        </div>
      </nav>

      {/* ── hero ── */}
      <section className="px-5 pb-12 pt-10 text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          <Sparkles size={12} />
          ditenagai AI
        </span>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight">
          cukup foto,<br />
          nutrisi <span className="text-accent">langsung ketahuan</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          foodie bantu kamu lacak kalori dan makro nutrisi dengan cara paling simpel —
          foto makanan, AI analisis, langsung tercatat. cocok buat diet, bulking, atau maintain.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-sm font-bold text-background"
          >
            mulai gratis sekarang
            <ChevronRight size={16} />
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-white/10 py-4 text-sm font-semibold text-muted hover:text-foreground"
          >
            sudah punya akun? masuk
          </Link>
        </div>
      </section>

      {/* ── demo card ── */}
      <section className="px-5 pb-12">
        <div className="glass overflow-hidden rounded-2xl">
          <div className="relative flex h-44 items-center justify-center bg-surface-2">
            <div className="flex flex-col items-center gap-2 text-muted">
              <Camera size={40} className="text-accent/60" />
              <span className="text-xs">foto makanan kamu</span>
            </div>
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-green/20 px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              <span className="text-[10px] font-semibold text-green">AI aktif</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-[10px] text-muted">terdeteksi · yakin 92%</p>
            <p className="text-base font-extrabold">nasi dan mie goreng</p>
            <p className="mt-0.5 text-[11px] text-muted">nasi putih, mie goreng dengan bumbu kecap, telur, dan lauk.</p>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {macros.map((m) => (
                <div key={m.label} className="rounded-xl bg-surface-2 p-2.5 text-center">
                  <p className={`text-base font-extrabold ${m.color}`}>{m.value}</p>
                  <p className="text-[9px] text-muted">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-green/15 py-2.5 text-center text-xs font-bold text-green">
              ✓ catat ke log harian
            </div>
          </div>
        </div>
      </section>

      {/* ── fitur ── */}
      <section className="px-5 pb-12">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">fitur</p>
        <h2 className="mb-6 text-2xl font-extrabold">semua yang kamu butuhkan</h2>
        <div className="flex flex-col gap-3">
          {features.map((f) => (
            <div key={f.title} className="glass flex gap-4 rounded-2xl p-5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${f.bg}`}>
                <f.icon size={22} className={f.color} />
              </div>
              <div>
                <p className="font-bold">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── cara kerja ── */}
      <section className="px-5 pb-12">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-green">cara kerja</p>
        <h2 className="mb-6 text-2xl font-extrabold">semudah 4 langkah</h2>
        <div className="flex flex-col gap-4">
          {steps.map((s, i) => (
            <div key={s.num} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-extrabold text-accent">
                  {s.num}
                </div>
                {i < steps.length - 1 && (
                  <div className="mt-1 h-full w-px bg-white/8" />
                )}
              </div>
              <div className="pb-4">
                <p className="font-bold">{s.title}</p>
                <p className="mt-0.5 text-sm text-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── tujuan ── */}
      <section className="px-5 pb-12">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-yellow">tujuan</p>
        <h2 className="mb-6 text-2xl font-extrabold">untuk semua tipe goals</h2>
        <div className="flex flex-col gap-3">
          {goals.map((g) => (
            <div key={g.type} className="glass flex items-center gap-4 rounded-2xl px-5 py-4">
              <span className="text-2xl">{g.emoji}</span>
              <div>
                <p className="font-bold">{g.type}</p>
                <p className="text-sm text-muted">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── trust ── */}
      <section className="px-5 pb-12">
        <div className="glass rounded-2xl p-5">
          <p className="mb-4 text-center text-sm font-semibold text-muted">kenapa foodie?</p>
          <div className="flex flex-col gap-4">
            {trustItems.map((t) => (
              <div key={t.label} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2">
                  <t.icon size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold">{t.label}</p>
                  <p className="text-xs text-muted">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── cta ── */}
      <section className="px-5 pb-16">
        <div className="glass rounded-2xl p-6 text-center">
          <h2 className="text-2xl font-extrabold">
            siap mulai <span className="text-accent">hidup lebih sehat?</span>
          </h2>
          <p className="mt-2 text-sm text-muted">
            gratis, tanpa kartu kredit, langsung bisa pakai.
          </p>
          <Link
            href="/register"
            className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-accent py-4 text-sm font-bold text-background"
          >
            buat akun gratis
            <ChevronRight size={16} />
          </Link>
          <Link
            href="/login"
            className="mt-2 block text-center text-xs text-muted hover:text-foreground"
          >
            sudah punya akun? masuk di sini
          </Link>
        </div>
      </section>

      {/* ── footer ── */}
      <footer className="glass border-t border-white/5 px-5 py-6 text-center">
        <p className="text-lg font-extrabold">
          foodie<span className="text-accent">.</span>
        </p>
        <p className="mt-1 text-xs text-muted">catat nutrisimu, capai goalmu.</p>
        <div className="mt-4 flex justify-center gap-4 text-xs text-muted">
          <Link href="/register" className="hover:text-foreground">daftar</Link>
          <Link href="/login" className="hover:text-foreground">masuk</Link>
        </div>
        <p className="mt-4 text-[10px] text-muted/50">© 2026 foodie. made with ♥</p>
      </footer>
    </div>
  );
}
