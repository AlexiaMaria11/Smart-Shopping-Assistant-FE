import { Box, Chip, Container, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "../../api/clients/OrderApiClient";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  OrderStatus,
  formatDate,
  money,
  type Order,
} from "../shared/types/Order";
import ErrorAlert from "../common/ErrorAlert";
import LoadingState from "../common/LoadingState";
import PackageActions from "../Orders/PackageActions";
import "../Orders/Orders.css";

type Filter = "todo" | "shipped" | "done";

const FILTERS: Record<Filter, OrderStatus[]> = {
  todo: [OrderStatus.Pending, OrderStatus.Confirmed],
  shipped: [OrderStatus.Shipped],
  done: [OrderStatus.Delivered, OrderStatus.Cancelled],
};

// The seller sees only their own package of each order
function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("todo");

  useEffect(() => {
    ordersApi
      .getForSeller()
      .then(setOrders)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => ({
      todo: orders.filter((o) => FILTERS.todo.includes(o.status)).length,
      shipped: orders.filter((o) => FILTERS.shipped.includes(o.status)).length,
      done: orders.filter((o) => FILTERS.done.includes(o.status)).length,
    }),
    [orders],
  );
  const visible = orders.filter((o) => FILTERS[filter].includes(o.status));

  function replaceOrder(updated: Order) {
    setOrders((current) => current.map((o) => (o.id === updated.id ? updated : o)));
    setError("");
  }

  return (
    <Box className="orders-page">
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h4" className="orders-title">
          Orders to fulfil
        </Typography>
        <ErrorAlert message={error} />

        <Tabs value={filter} onChange={(_, value) => setFilter(value)} sx={{ mb: 3 }}>
          <Tab value="todo" label={`To prepare (${counts.todo})`} />
          <Tab value="shipped" label={`On the way (${counts.shipped})`} />
          <Tab value="done" label={`Finished (${counts.done})`} />
        </Tabs>

        {loading ? (
          <LoadingState />
        ) : visible.length === 0 ? (
          <Typography className="orders-empty">Nothing here right now.</Typography>
        ) : (
          visible.map((order) => (
            <Box key={order.id} className="order-card">
              <Box className="order-card-header">
                <Box>
                  <Typography className="order-number">
                    <Link to={`/orders/${order.id}`}>Order {order.number}</Link>
                  </Typography>
                  <Typography className="order-meta">
                    {formatDate(order.createdAt)} · {order.shippingFullName}, {order.shippingCity} (
                    {order.shippingCounty})
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={ORDER_STATUS_LABELS[order.status]}
                  color={ORDER_STATUS_COLORS[order.status]}
                />
              </Box>

              {order.items.map((item) => (
                <Box
                  key={item.id}
                  className={`order-line${item.status === OrderStatus.Cancelled ? " order-line--cancelled" : ""}`}
                >
                  <img src={item.imageUrl} alt={item.productName} className="order-thumb" />
                  <Typography className="order-line-name">
                    {item.quantity} ×{" "}
                    {item.productId === null ? (
                      item.productName
                    ) : (
                      <Link to={`/products/${item.productId}`} className="order-line-link">
                        {item.productName}
                      </Link>
                    )}
                  </Typography>
                  <Typography className="order-line-price">{money(item.lineTotal)}</Typography>
                </Box>
              ))}

              <Box className="order-card-header" sx={{ mt: 1.5 }}>
                <Typography className="order-total">{money(order.total)}</Typography>
                <PackageActions
                  orderId={order.id}
                  status={order.status}
                  onUpdated={replaceOrder}
                  onError={setError}
                />
              </Box>
            </Box>
          ))
        )}
      </Container>
    </Box>
  );
}

export default SellerOrders;
