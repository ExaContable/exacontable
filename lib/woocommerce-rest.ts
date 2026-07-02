import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const wpUrl = process.env.WORDPRESS_URL || "https://admin.exacontable.com";
const consumerKey = process.env.WOOCOMMERCE_KEY || "";
const consumerSecret = process.env.WOOCOMMERCE_SECRET || "";

export const wooRest = new WooCommerceRestApi({
  url: wpUrl,
  consumerKey,
  consumerSecret,
  version: "wc/v3",
  queryStringAuth: true,
});

export async function fetchProducts(params?: Record<string, string | number>) {
  const { data } = await wooRest.get("products", params);
  return data;
}

export async function fetchProduct(id: number) {
  const { data } = await wooRest.get(`products/${id}`);
  return data;
}

export async function fetchProductCategories() {
  const { data } = await wooRest.get("products/categories");
  return data;
}

export async function createOrder(orderData: Record<string, unknown>) {
  const { data } = await wooRest.post("orders", orderData);
  return data;
}

export async function updateOrder(id: number, orderData: Record<string, unknown>) {
  const { data } = await wooRest.put(`orders/${id}`, orderData);
  return data;
}

export async function createCustomer(customerData: Record<string, unknown>) {
  const { data } = await wooRest.post("customers", customerData);
  return data;
}

export async function getOrder(id: number) {
  const { data } = await wooRest.get(`orders/${id}`);
  return data;
}
