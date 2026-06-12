# Foodie 🥗

Aplikasi cek nutrisi makanan untuk orang diet atau bulking. Foto makananmu → langsung lihat estimasi kalori dan makro nutrisi (protein, lemak, karbohidrat), lalu catat ke progres harian.

## Fitur (MVP)

1. **Scan foto makanan** — AI vision mendeteksi makanan dan estimasi nutrisinya, porsi bisa disesuaikan.
2. **Cari makanan** — database makanan lokal Indonesia (nasi goreng, rendang, tempe, dll.) dengan porsi fleksibel.
3. **Hitung kalori harian** — progres kalori vs target dengan indikator visual.
4. **Catat makro** — protein, lemak, karbohidrat tercatat per makanan dan terakumulasi harian.
5. **Rekomendasi target** — kalori & makro dihitung dari rumus Mifflin-St Jeor sesuai tujuan (diet −20% / bulking +12% / maintain).

Auth memakai **username + password** (session JWT di httpOnly cookie).

## Setup

```bash
npm install
cp .env.example .env.local   # isi DATABASE_URL, OPENAI_*, SESSION_SECRET

# siapkan database (PostgreSQL lokal atau Neon)
createdb foodie
npm run db:push              # buat tabel
npm run db:seed              # isi makanan lokal Indonesia

npm run dev
```

Buka [http://localhost:3000](http://localhost:3000), daftar akun, atur target di tab 🎯, lalu mulai scan/catat makanan.

## Tech Stack

- **Frontend/Backend:** Next.js 16 (App Router), Tailwind CSS v4 — mobile-first, dark glassmorphism
- **Database:** PostgreSQL (lokal untuk dev, Neon untuk production) + Drizzle ORM
- **AI:** OpenAI-compatible API (vision) via route server-side `/api/scan`
- **Auth:** bcryptjs + jose (JWT session cookie)
- **Deployment:** Vercel

## Struktur API

| Endpoint | Deskripsi |
|----------|-----------|
| `POST /api/auth/register` · `login` · `logout`, `GET /api/auth/me` | Autentikasi username/password |
| `GET/POST /api/goals` | Target nutrisi aktif (rekomendasi otomatis) |
| `GET /api/foods?q=` | Cari makanan di database lokal |
| `POST /api/scan` | Analisis foto makanan via AI vision |
| `GET/POST /api/logs`, `DELETE /api/logs/[id]` | Catatan asupan harian |
| `GET /api/summary?date=` | Total harian vs target + sisa |
