import {
  Chip,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "../../api/clients/OrderApiClient";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  formatDate,
  money,
  paymentLabel,
  type Order,
} from "../shared/types/Order";
import ErrorAlert from "../common/ErrorAlert";
import LoadingState from "../common/LoadingState";

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    ordersApi
      .getAll()
      .then(setOrders)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" className="page-header-title" sx={{ mb: 3 }}>
        Orders
      </Typography>
      <ErrorAlert message={error} />
      {loading ? (
        <LoadingState />
      ) : (
        <TableContainer component={Paper} className="data-table-container">
          <Table>
            <TableHead className="data-table-head">
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Sellers</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="data-table-body">
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <TableCell className="data-table-cell-bold">{order.number}</TableCell>
                  <TableCell className="data-table-cell-nowrap">{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    {order.customerName}
                    <br />
                    <span className="data-table-cell-muted">{order.customerEmail}</span>
                  </TableCell>
                  <TableCell>{[...new Set(order.items.map((i) => i.companyName))].join(", ")}</TableCell>
                  <TableCell className="data-table-cell-muted">{paymentLabel(order)}</TableCell>
                  <TableCell align="right" className="data-table-cell-bold">
                    {money(order.total)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={ORDER_STATUS_LABELS[order.status]}
                      color={ORDER_STATUS_COLORS[order.status]}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="data-table-empty">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default AdminOrders;
