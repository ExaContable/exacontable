const wpUrl = 'https://exacontable.com';

async function main() {
  const url = `${wpUrl}/wp-json/wc/store/v1/products?per_page=50`;
  console.log('Fetching from:', url);
  try {
    const res = await fetch(url);
    console.log('Response status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Products returned:', data.length);
      if (data.length > 0) {
        console.log('Sample product:', {
          id: data[0].id,
          name: data[0].name,
          price: data[0].prices?.price,
          categories: data[0].categories
        });
      }
    } else {
      const text = await res.text();
      console.log('Error content:', text);
    }
  } catch (error) {
    console.error('Fetch failed:', error.message);
  }
}

main();
