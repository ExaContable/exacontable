"use client";

import { useEffect, useCallback } from "react";
import { useCartStore } from "@/store/cart-store";
import {
  getCart,
  addToCart as storeAddToCart,
  removeCartItem as storeRemoveItem,
  updateCartItem as storeUpdateItem,
} from "@/lib/woocommerce-store";

const CART_TOKEN_KEY = "wc_cart_token";

function getStoredToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(`(^| )${CART_TOKEN_KEY}=([^;]+)`);
  return match ? decodeURIComponent(match[2]) : null;
}

function setStoredToken(token: string | null) {
  if (typeof document === "undefined") return;
  if (token) {
    document.cookie = `${CART_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
  } else {
    document.cookie = `${CART_TOKEN_KEY}=; path=/; max-age=0`;
  }
}

export function useCart() {
  const cart = useCartStore((s) => s.cart);
  const cartToken = useCartStore((s) => s.cartToken);
  const nonce = useCartStore((s) => s.nonce);
  const isOpen = useCartStore((s) => s.isOpen);
  const loading = useCartStore((s) => s.loading);

  const fetchCart = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      useCartStore.getState().setCart({ items: [], items_count: 0, totals: { total_price: "0", total_tax: "0", currency_code: "USD", currency_symbol: "$", currency_minor_unit: 2, currency_prefix: "$", currency_suffix: "" }, coupons: [], needs_payment: false, needs_shipping: false, payment_methods: [] }, null, null);
      return;
    }
    try {
      useCartStore.getState().setLoading(true);
      const { cart, nonce } = await getCart(token);
      useCartStore.getState().setCart(cart, token, nonce);
    } catch {
      setStoredToken(null);
      useCartStore.getState().setCart(null, null, null);
    } finally {
      useCartStore.getState().setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      useCartStore.getState().setCartToken(token);
      fetchCart();
    }
  }, [fetchCart]);

  const addItem = useCallback(
    async (productId: number, quantity: number = 1) => {
      try {
        useCartStore.getState().setLoading(true);
        const token = getStoredToken();
        const currentNonce = useCartStore.getState().nonce;
        const { cart, cartToken, nonce: newNonce } = await storeAddToCart(productId, quantity, token || undefined, currentNonce || undefined);
        setStoredToken(cartToken || null);
        useCartStore.getState().setCart(cart, cartToken, newNonce || null);
        useCartStore.getState().setOpen(true);
      } catch (err) {
        console.error("Error adding to cart:", err);
        throw err;
      } finally {
        useCartStore.getState().setLoading(false);
      }
    },
    []
  );

  const removeItem = useCallback(
    async (itemKey: string) => {
      try {
        useCartStore.getState().setLoading(true);
        const token = getStoredToken();
        const cart = await storeRemoveItem(itemKey, token || undefined);
        useCartStore.getState().setCart(cart, token);
      } catch (err) {
        console.error("Error removing item:", err);
      } finally {
        useCartStore.getState().setLoading(false);
      }
    },
    []
  );

  const updateItem = useCallback(
    async (itemKey: string, quantity: number) => {
      try {
        useCartStore.getState().setLoading(true);
        const token = getStoredToken();
        const cart = await storeUpdateItem(itemKey, quantity, token || undefined);
        useCartStore.getState().setCart(cart, token);
      } catch (err) {
        console.error("Error updating item:", err);
      } finally {
        useCartStore.getState().setLoading(false);
      }
    },
    []
  );

  return {
    cart,
    cartToken,
    nonce,
    isOpen,
    loading,
    itemCount: useCartStore.getState().getItemCount(),
    total: useCartStore.getState().getTotal(),
    setOpen: useCartStore.getState().setOpen,
    toggleOpen: useCartStore.getState().toggleOpen,
    fetchCart,
    addItem,
    removeItem,
    updateItem,
  };
}
