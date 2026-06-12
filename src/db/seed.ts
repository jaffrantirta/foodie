/* Seed makanan lokal Indonesia. Jalankan: npm run db:seed */
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { foods } from "./schema";

// Nilai nutrisi per porsi umum (estimasi dari data komposisi pangan Indonesia).
const SEED_FOODS: (typeof foods.$inferInsert)[] = [
  { name: "Nasi Putih", servingSizeG: "150", calories: 195, proteinG: "4.0", fatG: "0.4", carbsG: "44.0", aliases: ["nasi"] },
  { name: "Nasi Goreng", servingSizeG: "300", calories: 500, proteinG: "12.0", fatG: "20.0", carbsG: "65.0", aliases: ["nasgor"] },
  { name: "Nasi Uduk", servingSizeG: "200", calories: 360, proteinG: "6.0", fatG: "12.0", carbsG: "55.0", aliases: [] },
  { name: "Mie Goreng", servingSizeG: "250", calories: 450, proteinG: "10.0", fatG: "18.0", carbsG: "60.0", aliases: ["mi goreng"] },
  { name: "Mie Ayam", servingSizeG: "350", calories: 420, proteinG: "18.0", fatG: "14.0", carbsG: "55.0", aliases: ["mi ayam"] },
  { name: "Ayam Goreng (paha)", servingSizeG: "100", calories: 245, proteinG: "22.0", fatG: "17.0", carbsG: "1.0", aliases: ["ayam goreng"] },
  { name: "Ayam Bakar", servingSizeG: "100", calories: 200, proteinG: "24.0", fatG: "11.0", carbsG: "2.0", aliases: [] },
  { name: "Dada Ayam Rebus/Panggang", servingSizeG: "100", calories: 165, proteinG: "31.0", fatG: "3.6", carbsG: "0.0", aliases: ["dada ayam", "chicken breast"] },
  { name: "Rendang Sapi", servingSizeG: "100", calories: 285, proteinG: "19.0", fatG: "22.0", carbsG: "4.0", aliases: ["rendang"] },
  { name: "Sate Ayam (10 tusuk + bumbu kacang)", servingSizeG: "200", calories: 400, proteinG: "30.0", fatG: "24.0", carbsG: "14.0", aliases: ["sate"] },
  { name: "Bakso Sapi (semangkuk + mie)", servingSizeG: "400", calories: 380, proteinG: "20.0", fatG: "14.0", carbsG: "42.0", aliases: ["bakso"] },
  { name: "Soto Ayam", servingSizeG: "400", calories: 312, proteinG: "24.0", fatG: "12.0", carbsG: "26.0", aliases: ["soto"] },
  { name: "Gado-gado", servingSizeG: "300", calories: 380, proteinG: "14.0", fatG: "22.0", carbsG: "32.0", aliases: [] },
  { name: "Pecel Lele + Nasi", servingSizeG: "350", calories: 520, proteinG: "26.0", fatG: "22.0", carbsG: "55.0", aliases: ["pecel lele"] },
  { name: "Tempe Goreng", servingSizeG: "50", calories: 110, proteinG: "9.0", fatG: "6.5", carbsG: "5.0", aliases: ["tempe"] },
  { name: "Tahu Goreng", servingSizeG: "50", calories: 85, proteinG: "6.5", fatG: "5.5", carbsG: "2.5", aliases: ["tahu"] },
  { name: "Telur Rebus", servingSizeG: "60", calories: 90, proteinG: "7.5", fatG: "6.0", carbsG: "0.6", aliases: ["telur"] },
  { name: "Telur Dadar", servingSizeG: "70", calories: 150, proteinG: "8.0", fatG: "12.0", carbsG: "1.0", aliases: [] },
  { name: "Ikan Goreng (kembung)", servingSizeG: "100", calories: 220, proteinG: "20.0", fatG: "14.0", carbsG: "2.0", aliases: ["ikan goreng"] },
  { name: "Ikan Salmon Panggang", servingSizeG: "100", calories: 208, proteinG: "20.0", fatG: "13.0", carbsG: "0.0", aliases: ["salmon"] },
  { name: "Udang Rebus", servingSizeG: "100", calories: 99, proteinG: "24.0", fatG: "0.3", carbsG: "0.2", aliases: ["udang"] },
  { name: "Capcay Kuah", servingSizeG: "300", calories: 180, proteinG: "10.0", fatG: "8.0", carbsG: "18.0", aliases: ["capcay"] },
  { name: "Sayur Asem", servingSizeG: "250", calories: 80, proteinG: "3.0", fatG: "1.5", carbsG: "14.0", aliases: [] },
  { name: "Sayur Lodeh", servingSizeG: "250", calories: 160, proteinG: "5.0", fatG: "10.0", carbsG: "13.0", aliases: ["lodeh"] },
  { name: "Oatmeal", servingSizeG: "40", calories: 150, proteinG: "5.0", fatG: "3.0", carbsG: "27.0", aliases: ["oat"] },
  { name: "Roti Tawar (2 lembar)", servingSizeG: "70", calories: 185, proteinG: "6.0", fatG: "2.5", carbsG: "34.0", aliases: ["roti"] },
  { name: "Pisang", servingSizeG: "100", calories: 89, proteinG: "1.1", fatG: "0.3", carbsG: "23.0", aliases: [] },
  { name: "Alpukat", servingSizeG: "100", calories: 160, proteinG: "2.0", fatG: "15.0", carbsG: "9.0", aliases: ["avocado"] },
  { name: "Susu Full Cream (1 gelas)", servingSizeG: "250", calories: 150, proteinG: "8.0", fatG: "8.0", carbsG: "12.0", aliases: ["susu"] },
  { name: "Whey Protein (1 scoop)", servingSizeG: "30", calories: 120, proteinG: "24.0", fatG: "1.5", carbsG: "3.0", aliases: ["whey", "protein shake"] },
  { name: "Martabak Manis (1 potong)", servingSizeG: "100", calories: 350, proteinG: "6.0", fatG: "15.0", carbsG: "48.0", aliases: ["martabak"] },
  { name: "Gorengan Bakwan", servingSizeG: "60", calories: 140, proteinG: "3.0", fatG: "8.0", carbsG: "14.0", aliases: ["bakwan"] },
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  const inserted = await db
    .insert(foods)
    .values(SEED_FOODS)
    .onConflictDoNothing()
    .returning({ id: foods.id });

  console.log(`Seed selesai: ${inserted.length} makanan ditambahkan.`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
