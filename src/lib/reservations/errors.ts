export class InsufficientStockError extends Error {
  constructor() {
    super("Insufficient stock");
  }
}

export class InventoryNotFoundError extends Error {
  constructor() {
    super("Inventory not found");
  }
}

export class ReservationExpiredError extends Error {
  constructor() {
    super("Reservation expired");
  }
}

export class ReservationConflictError extends Error {
  constructor(message: string) {
    super(message);
  }
}
