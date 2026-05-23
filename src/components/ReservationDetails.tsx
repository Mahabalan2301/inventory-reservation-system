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
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Reservation details</CardTitle>
          <Badge variant={statusVariant[reservation.status]}>
            {reservation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-border pb-3">
          <span className="text-muted-foreground">Product</span>
          <span className="font-medium text-right">{reservation.product.name}</span>
        </div>
        <div className="flex justify-between gap-4 border-b border-border pb-3">
          <span className="text-muted-foreground">Warehouse</span>
          <span className="font-medium text-right">
            {reservation.warehouse.name}
            <span className="block text-xs text-muted-foreground">
              {reservation.warehouse.city}
            </span>
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Quantity</span>
          <span className="font-medium">{reservation.quantity}</span>
        </div>
      </CardContent>
    </Card>
  );
}
