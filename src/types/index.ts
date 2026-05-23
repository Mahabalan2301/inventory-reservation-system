export type WarehouseStock = {
  warehouseId: string;
  warehouseName: string;
  location: string;
  totalStock: number;
  availableStock: number;
  reservedStock: number;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  image: string;
  warehouses: WarehouseStock[];
};

export type ProductsResponse = {
  products: Product[];
};

export type ReservationStatus = "PENDING" | "CONFIRMED" | "RELEASED";

export type ReservationProduct = {
  id: string;
  name: string;
  description: string | null;
};

export type ReservationWarehouse = {
  id: string;
  name: string;
  city: string;
};

export type Reservation = {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  status: ReservationStatus;
  expiresAt: string;
  createdAt: string;
  product: ReservationProduct;
  warehouse: ReservationWarehouse;
};

export type ReservationResponse = {
  reservation: Reservation;
};

export type ReservationsResponse = {
  reservations: Reservation[];
};

export type CreateReservationPayload = {
  productId: string;
  warehouseId: string;
  quantity: number;
};

export type ApiError = {
  error?: string;
  message?: string;
};

export type StockLevel = "available" | "low" | "out";
