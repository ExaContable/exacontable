const STORE_API = "/api/woocommerce";

async function storeFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${STORE_API}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Store API error: ${res.status} ${error}`);
  }
  return res.json();
}

export async function getProducts(params?: string) {
  return storeFetch(`/products${params ? `?${params}` : ""}`);
}

export async function getProduct(id: number) {
  return storeFetch(`/products/${id}`);
}

export async function getCart(cartToken?: string) {
  const headers: Record<string, string> = {};
  if (cartToken) headers["Cart-Token"] = cartToken;
  const res = await fetch("/api/woocommerce/cart", { headers });
  if (!res.ok) throw new Error(`Store API error: ${res.status}`);
  const nonce = res.headers.get("X-WC-Store-API-Nonce") || "";
  const cart = await res.json();
  return { cart, nonce };
}

export async function addToCart(productId: string | number, quantity: number = 1, cartToken?: string, nonce?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cartToken) headers["Cart-Token"] = cartToken;
  if (nonce) headers["X-WC-Store-API-Nonce"] = nonce;

  const res = await fetch("/api/woocommerce/cart/add-item", {
    method: "POST",
    headers,
    body: JSON.stringify({
      id: productId,
      quantity,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Add to cart error: ${res.status} ${error}`);
  }

  const newCartToken = res.headers.get("Cart-Token") || cartToken;
  const data = await res.json();
  return { cart: data.cart, cartToken: data.cartToken || newCartToken, nonce: data.nonce };
}

export async function removeCartItem(itemKey: string, cartToken?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cartToken) headers["Cart-Token"] = cartToken;

  const res = await fetch(`${STORE_API}/cart/remove-item`, {
    method: "POST",
    headers,
    body: JSON.stringify({ key: itemKey }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Remove item error: ${res.status} ${error}`);
  }
  return res.json();
}

export async function updateCartItem(itemKey: string, quantity: number, cartToken?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cartToken) headers["Cart-Token"] = cartToken;

  const res = await fetch(`${STORE_API}/cart/update-item`, {
    method: "POST",
    headers,
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
  cartToken?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cartToken) headers["Cart-Token"] = cartToken;

  const res = await fetch(`${STORE_API}/checkout`, {
    method: "POST",
    headers,
    body: JSON.stringify(checkoutData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Checkout error: ${res.status} ${error}`);
  }
  return res.json();
}
