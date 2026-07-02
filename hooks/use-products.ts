"use client";

import { useState, useEffect, useCallback } from "react";
import type { StoreProduct } from "@/types";

export function useProducts(params?: string) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `/api/woocommerce/products${params ? `?${params}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error: ${res.status}`);
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    let cancelled = false;

    const doFetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `/api/woocommerce/products${params ? `?${params}` : ""}`;
        const res = await fetch(url);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Error: ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar productos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    doFetch();
    return () => { cancelled = true; };
  }, [params]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(id: number | null) {
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/woocommerce/products?id=${id}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar producto");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
