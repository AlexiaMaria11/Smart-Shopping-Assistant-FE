import { Box, Button } from "@mui/material";
import { useState } from "react";
import { ordersApi } from "../../api/clients/OrderApiClient";
import { OrderStatus, type Order } from "../shared/types/Order";

const NEXT_STEP: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  [OrderStatus.Pending]: { status: OrderStatus.Confirmed, label: "Confirm order" },
  [OrderStatus.Confirmed]: { status: OrderStatus.Shipped, label: "Mark as shipped" },
  [OrderStatus.Shipped]: { status: OrderStatus.Delivered, label: "Mark as delivered" },
};

interface PackageActionsProps {
  orderId: number;
  status: OrderStatus;
  // Only needed when an admin acts on behalf of a seller
  companyId?: number;
  onUpdated: (order: Order) => void;
  onError: (message: string) => void;
}

// Buttons that move one seller's package to its next step
function PackageActions({ orderId, status, companyId, onUpdated, onError }: PackageActionsProps) {
  const [busy, setBusy] = useState(false);
  const next = NEXT_STEP[status];
  const canCancel = status === OrderStatus.Pending || status === OrderStatus.Confirmed;

  async function update(newStatus: OrderStatus) {
    if (
      newStatus === OrderStatus.Cancelled &&
      !window.confirm("Cancel this package? The customer will not receive these products.")
    ) {
      return;
    }
    setBusy(true);
    try {
      onUpdated(await ordersApi.updateStatus(orderId, newStatus, companyId));
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!next && !canCancel) return null;

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {next && (
        <Button
          size="small"
          variant="contained"
          color="primary"
          disabled={busy}
          onClick={() => update(next.status)}
        >
          {next.label}
        </Button>
      )}
      {canCancel && (
        <Button
          size="small"
          variant="outlined"
          color="error"
          disabled={busy}
          onClick={() => update(OrderStatus.Cancelled)}
        >
          Cancel package
        </Button>
      )}
    </Box>
  );
}

export default PackageActions;
