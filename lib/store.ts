const API = "/api";

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error: ${res.status} ${error}`);
  }
  return res.json();
}

export async function getProducts(params?: string) {
  return apiFetch(`/products${params ? `?${params}` : ""}`);
}

export async function getProduct(id: number) {
  return apiFetch(`/products?id=${id}`);
}

export async function getCart() {
  const res = await fetch("/api/cart");
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const cart = await res.json();
  return { cart, nonce: "local_nonce" };
}

export async function addToCart(productId: string | number, quantity: number = 1) {
  const res = await fetch("/api/cart/add-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: productId, quantity }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Add to cart error: ${res.status} ${error}`);
  }

  const data = await res.json();
  return { cart: data.cart, cartToken: data.cartToken || "local_cart", nonce: "local_nonce" };
}

export async function removeCartItem(itemKey: string) {
  const res = await fetch("/api/cart/remove-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: itemKey }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Remove item error: ${res.status} ${error}`);
  }
  return res.json();
}

export async function updateCartItem(itemKey: string, quantity: number) {
  const res = await fetch("/api/cart/update-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: itemKey, quantity }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Update item error: ${res.status} ${error}`);
  }
  return res.json();
}

export async function checkout(
  checkoutData: Record<string, unknown>,
) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ checkoutData }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Checkout error: ${res.status} ${error}`);
  }
  return res.json();
}
