const Database = require('better-sqlite3');
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
require('dotenv').config({ path: '.env.local' });

const wpUrl = process.env.WORDPRESS_URL || 'https://exacontable.com';
const consumerKey = process.env.WOOCOMMERCE_KEY || '';
const consumerSecret = process.env.WOOCOMMERCE_SECRET || '';

const wooRest = new WooCommerceRestApi({
  url: wpUrl,
  consumerKey,
  consumerSecret,
  version: 'wc/v3',
  queryStringAuth: true,
});

async function fetchProducts(params) {
  const { data } = await wooRest.get('products', params);
  return data;
}

async function fetchProductCategories() {
  const { data } = await wooRest.get('products/categories');
  return data;
}

const db = new Database('dev.db');

// Ensure Plan table exists, if not we will know.
try {
  db.prepare("SELECT 1 FROM Plan LIMIT 1").run();
} catch (e) {
  console.error("Plan table does not exist or dev.db is not initialized:", e.message);
  process.exit(1);
}

function generateId() {
  return 'c' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
}

async function main() {
  try {
    console.log('Fetching categories from WooCommerce...');
    const categories = await fetchProductCategories();

    const allowedSlugs = ["plan-sistema-contable", "plan-contador", "facturacion-electronica", "servicios"];
    const planCategories = categories.filter((cat) =>
      allowedSlugs.includes(cat.slug)
    );

    console.log(`Found ${planCategories.length} matching categories.`);

    const plansToSync = [];

    for (const cat of planCategories) {
      console.log(`Fetching products for category: ${cat.name} (${cat.slug})...`);
      const products = await fetchProducts({
        category: cat.id,
        per_page: 100,
      });
      console.log(`Found ${products.length} products in ${cat.slug}.`);
      
      const mapped = products.map((p) => {
        const nameLower = p.name.toLowerCase();
        const slugLower = p.slug.toLowerCase();
        
        let category = "planes-mensuales";
        let period = "mensual";

        if (slugLower.includes("compra-total") || nameLower.includes("compra total") || nameLower.includes("pago único") || nameLower.includes("unico")) {
          category = "compra-total";
          period = "unico";
        } else if (slugLower.includes("anual") || nameLower.includes("anual") || nameLower.includes("basico") || nameLower.includes("ideal") || nameLower.includes("ilimitado")) {
          category = "planes-anuales";
          period = "anual";
        }

        const descriptionClean = p.description ? p.description.replace(/<[^>]*>/g, "").trim() : "";
        const features = descriptionClean 
          ? descriptionClean.split("\n").map(f => f.replace(/^[-•*+]\s*/, "").trim()).filter(Boolean)
          : [];

        return {
          name: p.name,
          slug: p.slug,
          description: descriptionClean,
          price: parseFloat(p.price) || 0,
          category,
          period,
          features: JSON.stringify(features),
          isActive: p.status === "publish" ? 1 : 0,
          sortOrder: 0,
        };
      });
      plansToSync.push(...mapped);
    }

    console.log(`Total plans to sync: ${plansToSync.length}`);
    let imported = 0;
    let updated = 0;

    const findStmt = db.prepare('SELECT id FROM Plan WHERE slug = ?');
    const insertStmt = db.prepare(`
      INSERT INTO Plan (id, name, slug, description, price, category, period, features, isActive, sortOrder, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    const updateStmt = db.prepare(`
      UPDATE Plan 
      SET name = ?, description = ?, price = ?, category = ?, period = ?, features = ?, isActive = ?, updatedAt = datetime('now')
      WHERE slug = ?
    `);

    // Wrap in a transaction for performance and safety
    const transaction = db.transaction((plans) => {
      for (const plan of plans) {
        const existing = findStmt.get(plan.slug);
        if (existing) {
          updateStmt.run(
            plan.name,
            plan.description,
            plan.price,
            plan.category,
            plan.period,
            plan.features,
            plan.isActive,
            plan.slug
          );
          updated++;
        } else {
          insertStmt.run(
            generateId(),
            plan.name,
            plan.slug,
            plan.description,
            plan.price,
            plan.category,
            plan.period,
            plan.features,
            plan.isActive,
            plan.sortOrder
          );
          imported++;
        }
      }
    });

    transaction(plansToSync);

    console.log(`Sync completed successfully. Imported: ${imported}, Updated: ${updated}`);
  } catch (error) {
    console.error('Error syncing plans:', error);
  } finally {
    db.close();
  }
}

main();
