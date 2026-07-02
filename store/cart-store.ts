import { create } from "zustand";
import type { Cart } from "@/types";

interface CartState {
  cart: Cart | null;
  cartToken: string | null;
  nonce: string | null;
  isOpen: boolean;
  loading: boolean;
  setCart: (cart: Cart | null, token?: string | null, nonce?: string | null) => void;
  setCartToken: (token: string | null) => void;
  setNonce: (nonce: string | null) => void;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  setLoading: (loading: boolean) => void;
  getItemCount: () => number;
  getTotal: () => string;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  cartToken: null,
  nonce: null,
  isOpen: false,
  loading: false,
  setCart: (cart, token, nonce) =>
    set({
      cart,
      cartToken: token !== undefined ? token : get().cartToken,
      nonce: nonce !== undefined ? nonce : get().nonce,
    }),
  setCartToken: (token) => set({ cartToken: token }),
  setNonce: (nonce) => set({ nonce }),
  setOpen: (open) => set({ isOpen: open }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setLoading: (loading) => set({ loading }),
  getItemCount: () => {
    return get().cart?.items_count ?? 0;
  },
  getTotal: () => {
    const cart = get().cart;
    if (!cart) return "$0.00";
    const total = parseInt(cart.totals.total_price);
    const minorUnit = cart.totals.currency_minor_unit || 2;
    const divisor = Math.pow(10, minorUnit);
    const formatted = (total / divisor).toFixed(minorUnit);
    return `${cart.totals.currency_prefix}${formatted}${cart.totals.currency_suffix}`;
  },
}));
