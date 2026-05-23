"use client";

import useSWR from "swr";
import { api } from "@/services/api";
import type { Reservation } from "@/types";

const fetcher = (id: string) =>
  api.getReservation(id).then((res) => res.reservation);

export function useReservation(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Reservation>(
    id ? `/api/reservations/${id}` : null,
    () => fetcher(id!),
    {
      refreshInterval: 5_000,
      revalidateOnFocus: true,
    },
  );

  return {
    reservation: data,
    error,
    isLoading,
    mutate,
  };
}
