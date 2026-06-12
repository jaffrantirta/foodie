// Batas hari dihitung dalam timezone aplikasi (WIB), bukan timezone server —
// server Vercel berjalan di UTC dan env TZ direservasi oleh platform.
const APP_TZ = "Asia/Jakarta";
const APP_TZ_OFFSET = "+07:00"; // WIB, tanpa DST

export function dayRange(dateStr?: string | null): {
  start: Date;
  end: Date;
  dateStr: string;
} {
  const day =
    dateStr ??
    new Intl.DateTimeFormat("en-CA", { timeZone: APP_TZ }).format(new Date());
  const start = new Date(`${day}T00:00:00${APP_TZ_OFFSET}`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end, dateStr: day };
}
