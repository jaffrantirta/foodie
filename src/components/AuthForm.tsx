"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Salad } from "lucide-react";
import { api } from "@/lib/clientApi";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api(`/api/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(
          isRegister ? { username, password, fullName } : { username, password }
        ),
      });
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <Salad size={44} className="text-green" aria-hidden />
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Foodie</h1>
        <p className="mt-1 text-sm text-muted">
          Cek nutrisi makananmu — untuk diet & bulking
        </p>
      </div>

      <form onSubmit={submit} className="glass flex flex-col gap-4 rounded-2xl p-6">
        <h2 className="text-lg font-bold">
          {isRegister ? "Buat Akun" : "Masuk"}
        </h2>
        {isRegister && (
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nama lengkap (opsional)"
            className={inputCls}
          />
        )}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoCapitalize="none"
          autoComplete="username"
          required
          className={inputCls}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          required
          minLength={6}
          className={inputCls}
        />
        {error && <p className="text-sm text-red">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-accent py-3 font-bold text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Memproses…" : isRegister ? "Daftar" : "Masuk"}
        </button>
        <p className="text-center text-sm text-muted">
          {isRegister ? (
            <>
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-accent">
                Masuk
              </Link>
            </>
          ) : (
            <>
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-accent">
                Daftar
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
