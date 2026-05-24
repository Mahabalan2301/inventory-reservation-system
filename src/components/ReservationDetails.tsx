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
    <Card className="card-premium">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Reservation Details</CardTitle>
          <Badge variant={statusVariant[reservation.status]}>
            {reservation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between gap-4 items-start pb-4 border-b border-border">
          <span className="text-secondary-text font-medium">Product</span>
          <span className="font-bold text-right text-foreground">{reservation.product.name}</span>
        </div>
        <div className="flex justify-between gap-4 items-start pb-4 border-b border-border">
          <span className="text-secondary-text font-medium">Warehouse</span>
          <div className="text-right">
            <p className="font-bold text-foreground">
              {reservation.warehouse.name}
            </p>
            <p className="text-xs text-secondary-text mt-1">
              {reservation.warehouse.city}
            </p>
          </div>
        </div>
        <div className="flex justify-between gap-4 items-center">
          <span className="text-secondary-text font-medium">Quantity</span>
          <span className="font-bold text-xl text-primary">{reservation.quantity}</span>
        </div>
      </CardContent>
    </Card>
  );
}
