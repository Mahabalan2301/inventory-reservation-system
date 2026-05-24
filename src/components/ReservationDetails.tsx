import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Reservation, ReservationStatus } from "@/types";

type ReservationDetailsProps = {
  reservation: Reservation;
};

const statusVariant: Record<
  ReservationStatus,
  "default" | "success" | "warning" | "secondary"
> = {
  PENDING: "warning",
  CONFIRMED: "success",
  RELEASED: "secondary",
};

export function ReservationDetails({ reservation }: ReservationDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <CardTitle>Reservation Details</CardTitle>
          <Badge variant={statusVariant[reservation.status]}>
            {reservation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-0 text-sm">
        <div className="flex flex-col justify-between gap-1 border-b border-border py-3 sm:flex-row sm:items-center">
          <span className="text-muted-foreground">Product</span>
          <span className="font-medium text-foreground">
            {reservation.product.name}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-1 border-b border-border py-3 sm:flex-row sm:items-center">
          <span className="text-muted-foreground">Warehouse</span>
          <div className="sm:text-right">
            <p className="font-medium text-foreground">
              {reservation.warehouse.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {reservation.warehouse.city}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center">
          <span className="text-muted-foreground">Quantity</span>
          <span className="text-lg font-semibold tabular-nums text-foreground">
            {reservation.quantity}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
