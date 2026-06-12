"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Camera, Home, Search, Target } from "lucide-react";
import { api, ApiError } from "@/lib/clientApi";

const NAV = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/scan", label: "Scan", Icon: Camera },
  { href: "/search", label: "Cari", Icon: Search },
  { href: "/goals", label: "Target", Icon: Target },
] as const;

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    api<{ username: string }>("/api/auth/me")
      .then((me) => setUsername(me.username))
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) router.replace("/login");
      });
  }, [router]);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  if (!username) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted">
        Memuat…
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="sticky top-0 z-10 glass flex items-center justify-between px-5 py-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">{title}</h1>
          <p className="text-xs text-muted">@{username}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted hover:text-red"
        >
          Keluar
        </button>
      </header>

      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>

      <nav className="glass fixed inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-md justify-around rounded-t-2xl px-2 py-2">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 rounded-xl px-4 py-1.5 text-xs transition ${
                active ? "bg-accent/15 font-bold text-accent" : "text-muted"
              }`}
            >
              <Icon size={18} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
