import type {
  ApiError,
  CreateReservationPayload,
  ProductsResponse,
  ReservationResponse,
} from "@/types";

const baseUrl =
  typeof window !== "undefined"
    ? ""
    : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const data = (await response.json()) as T & ApiError;

  if (!response.ok) {
    const message =
      data.error ?? data.message ?? `Request failed (${response.status})`;
    const error = new Error(message) as Error & { status: number };
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  getProducts: () => request<ProductsResponse>("/api/products"),

  getReservation: (id: string) =>
    request<ReservationResponse>(`/api/reservations/${id}`),

  createReservation: (payload: CreateReservationPayload) => {
    const idempotencyKey = crypto.randomUUID();
    return request<ReservationResponse>("/api/reservations", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    });
  },

  confirmReservation: (id: string) =>
    request<ReservationResponse>(`/api/reservations/${id}/confirm`, {
      method: "POST",
    }),

  releaseReservation: (id: string) =>
    request<ReservationResponse>(`/api/reservations/${id}/release`, {
      method: "POST",
    }),
};

export function getStockLevel(
  available: number,
  total: number,
): "available" | "low" | "out" {
  if (available <= 0) return "out";
  if (total > 0 && available / total <= 0.25) return "low";
  return "available";
}
