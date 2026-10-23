/**
 * Creates the schema, seeds site content from the original static data files (only into
 * empty tables, so deleting an item in the admin never brings it back), and creates the
 * first admin user from ADMIN_EMAIL / ADMIN_PASSWORD.
 *
 *   npm run db:setup
 */
import bcrypt from "bcryptjs";
import pg from "pg";
import { SCHEMA_SQL } from "../src/db/schema";
import {
  hotelsData,
  campsData,
  toursData,
  destinationsData,
  testimonialsData,
  packagesData,
} from "../src/data/jaisalmerData";
import { galleryImages, galleryCategories } from "../src/data/galleryData";
import { DEFAULT_SETTINGS } from "../src/lib/settings-defaults";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set (run via `npm run db:setup`).");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, max: 1 });

async function isEmpty(table: string) {
  const r = await pool.query(`select count(*)::int as n from ${table}`);
  return r.rows[0].n === 0;
}

async function seedStays(table: "hotels" | "camps", items: any[]) {
  if (!(await isEmpty(table))) return console.log(`  · ${table}: already has data, skipped`);
  let i = 0;
  for (const h of items) {
    await pool.query(
      `insert into ${table} (id,name,rating,reviews,location,price,image,tag,amenities,description,featured,sort_order)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [h.id, h.name, h.rating, h.reviews, h.location, h.price, h.image, h.tag ?? null,
        JSON.stringify(h.amenities ?? []), h.description, i < 3, i * 10]
    );
    i++;
  }
  console.log(`  ✓ ${table}: ${items.length} seeded`);
}

async function main() {
  console.log("Creating schema…");
  await pool.query(SCHEMA_SQL);
  console.log("  ✓ schema ready");

  console.log("Seeding content…");
  await seedStays("hotels", hotelsData);
  await seedStays("camps", campsData);

  if (await isEmpty("tours")) {
    let i = 0;
    for (const t of toursData) {
      await pool.query(
        `insert into tours (id,title,price,unit,image,duration,rating,reviews,location,tag,description,featured,sort_order)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [t.id, t.title, t.price, t.unit, t.image, t.duration, t.rating, t.reviews, t.location,
          t.tag ?? null, t.description, i < 4, i * 10]
      );
      i++;
    }
    console.log(`  ✓ tours: ${toursData.length} seeded`);
  }

  if (await isEmpty("destinations")) {
    let i = 0;
    for (const d of destinationsData) {
      await pool.query(
        `insert into destinations (id,name,subtitle,image,distance,description,featured,sort_order)
         values ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [d.id, d.name, d.subtitle, d.image, d.distance, d.description, true, i * 10]
      );
      i++;
    }
    console.log(`  ✓ destinations: ${destinationsData.length} seeded`);
  }

  if (await isEmpty("testimonials")) {
    let i = 0;
    for (const t of testimonialsData) {
      await pool.query(
        `insert into testimonials (id,name,city,avatar,rating,review,sort_order) values ($1,$2,$3,$4,$5,$6,$7)`,
        [t.id, t.name, t.city, t.avatar, t.rating, t.review, i * 10]
      );
      i++;
    }
    console.log(`  ✓ testimonials: ${testimonialsData.length} seeded`);
  }

  if (await isEmpty("packages")) {
    let i = 0;
    for (const p of packagesData) {
      await pool.query(
        `insert into packages (id,name,duration,rating,reviews,price,original_price,category,image,tag,location,description,inclusions,itinerary,featured,sort_order)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [p.id, p.name, p.duration, p.rating, p.reviews, p.price, p.originalPrice ?? null, p.category,
          p.image, p.tag ?? null, p.location, p.description, JSON.stringify(p.inclusions ?? []),
          JSON.stringify(p.itinerary ?? []), i < 3, i * 10]
      );
      i++;
    }
    console.log(`  ✓ packages: ${packagesData.length} seeded`);
  }

  if (await isEmpty("gallery_categories")) {
    let i = 0;
    for (const c of galleryCategories.filter((c) => c.id !== "all")) {
      await pool.query(`insert into gallery_categories (id,label,sort_order) values ($1,$2,$3)`, [c.id, c.label, i * 10]);
      i++;
    }
    console.log("  ✓ gallery categories seeded");
  }

  if (await isEmpty("gallery_images")) {
    let i = 0;
    for (const g of galleryImages) {
      await pool.query(
        `insert into gallery_images (id,src,title,category,location,aspect,sort_order) values ($1,$2,$3,$4,$5,$6,$7)`,
        [g.id, g.src, g.title, g.category, g.location, g.aspect ?? "landscape", i * 10]
      );
      i++;
    }
    console.log(`  ✓ gallery: ${galleryImages.length} photos seeded`);
  }

  await pool.query(
    `insert into settings (key, value) values ('site', $1) on conflict (key) do nothing`,
    [JSON.stringify(DEFAULT_SETTINGS)]
  );
  console.log("  ✓ settings ready");

  console.log("Admin user…");
  const admins = await pool.query(`select count(*)::int as n from admin_users`);
  if (admins.rows[0].n === 0) {
    const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "";
    const name = process.env.ADMIN_NAME || "Administrator";
    if (!email || password.length < 8) {
      console.warn("  ! No admin created: set ADMIN_EMAIL and ADMIN_PASSWORD (min 8 chars) in .env and re-run.");
    } else {
      const hash = await bcrypt.hash(password, 12);
      await pool.query(
        `insert into admin_users (name,email,password_hash,role) values ($1,$2,$3,'admin')`,
        [name, email, hash]
      );
      console.log(`  ✓ admin created: ${email}`);
    }
  } else {
    console.log("  · admin users already exist, skipped");
  }

  await pool.end();
  console.log("Done.");
}

main().catch(async (e) => {
  console.error(e);
  await pool.end().catch(() => {});
  process.exit(1);
});
