import { Box, Button, Chip, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "../../api/clients/OrderApiClient";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  formatDate,
  money,
  type Order,
} from "../shared/types/Order";
import ErrorAlert from "../common/ErrorAlert";
import LoadingState from "../common/LoadingState";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ordersApi
      .getMine()
      .then(setOrders)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box className="orders-page">
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h4" className="orders-title">
          My orders
        </Typography>
        <ErrorAlert message={error} />

        {loading ? (
          <LoadingState />
        ) : orders.length === 0 ? (
          <Box className="orders-empty">
            <Typography sx={{ mb: 2 }}>You have not placed any orders yet.</Typography>
            <Button component={Link} to="/shop" variant="contained" color="primary">
              Start shopping
            </Button>
          </Box>
        ) : (
          orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="order-card">
              <Box className="order-card-header">
                <Box>
                  <Typography className="order-number">Order {order.number}</Typography>
                  <Typography className="order-meta">
                    {formatDate(order.createdAt)} · {order.itemCount}{" "}
                    {order.itemCount === 1 ? "product" : "products"}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={ORDER_STATUS_LABELS[order.status]}
                  color={ORDER_STATUS_COLORS[order.status]}
                />
              </Box>
              <Box className="order-thumbs">
                {order.items.slice(0, 6).map((item) => (
                  <img
                    key={item.id}
                    src={item.imageUrl}
                    alt={item.productName}
                    className="order-thumb"
                  />
                ))}
              </Box>
              <Typography className="order-total">{money(order.total)}</Typography>
            </Link>
          ))
        )}
      </Container>
    </Box>
  );
}

export default Orders;
