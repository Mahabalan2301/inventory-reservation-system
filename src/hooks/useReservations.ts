"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import type { Reservation } from "@/types";

const fetcher = () =>
  api
    .getReservations()
    .then((res) => res.reservations)
    .catch(() => []);

export function useReservations() {
  const { data, error, isLoading } = useSWR<Reservation[]>(
    "/api/reservations",
    fetcher,
    {
      refreshInterval: 10_000,
      dedupingInterval: 0,
      revalidateOnFocus: true,
      revalidateIfStale: true,
    }
  );

  const activeReservations = (data ?? []).filter(
    (r) => r.status === "PENDING"
  ).length;

  return {
    reservations: data ?? [],
    activeReservations,
    error,
    isLoading,
  };
}
