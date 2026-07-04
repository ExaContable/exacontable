const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
require('dotenv').config({ path: '.env.local' });

const wpUrl = process.env.WORDPRESS_URL || 'https://exacontable.com';
const consumerKey = process.env.WOOCOMMERCE_KEY || '';
const consumerSecret = process.env.WOOCOMMERCE_SECRET || '';

console.log('WordPress URL:', wpUrl);
console.log('Consumer Key prefix:', consumerKey.slice(0, 8));

const wooRest = new WooCommerceRestApi({
  url: wpUrl,
  consumerKey,
  consumerSecret,
  version: 'wc/v3',
  queryStringAuth: true,
});

async function main() {
  try {
    console.log('Fetching categories...');
    const { data: categories } = await wooRest.get('products/categories');
    console.log('Categories found:', categories.length);
    console.log('Category names and slugs:');
    categories.forEach(c => console.log(`- ${c.name} (${c.slug}) id: ${c.id}`));

    console.log('\nFetching products...');
    const { data: products } = await wooRest.get('products', { per_page: 50 });
    console.log('Products found:', products.length);
    products.forEach(p => console.log(`- ${p.name} (${p.slug}) price: ${p.price}`));

  } catch (error) {
    console.error('Error connecting to WooCommerce:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

main();
