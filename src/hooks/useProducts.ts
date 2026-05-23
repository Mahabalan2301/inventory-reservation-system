"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import type { Product } from "@/types";

const fetcher = () => api.getProducts().then((res) => res.products);

export function useProducts() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Product[]>(
    "/api/products",
    fetcher,
    {
      refreshInterval: 10_000,
      dedupingInterval: 0,
      revalidateOnFocus: true,
      revalidateIfStale: true,
    },
  );

  return {
    products: data ?? [],
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
