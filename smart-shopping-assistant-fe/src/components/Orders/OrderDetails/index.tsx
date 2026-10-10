import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ordersApi } from "../../../api/clients/OrderApiClient";
import { Role } from "../../../api/models/AuthModel";
import { useAuth } from "../../../context/AuthContext/auth-context";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  OrderStatus,
  formatDate,
  money,
  paymentLabel,
  type Order,
  type OrderItem,
} from "../../shared/types/Order";
import ErrorAlert from "../../common/ErrorAlert";
import LoadingState from "../../common/LoadingState";
import PackageActions from "../PackageActions";
import "../Orders.css";

const STEPS = [OrderStatus.Pending, OrderStatus.Confirmed, OrderStatus.Shipped, OrderStatus.Delivered];

interface Package {
  companyId: number;
  companyName: string;
  status: OrderStatus;
  items: OrderItem[];
}

// Each seller ships its own package; its status is that of its slowest item
function toPackages(order: Order): Package[] {
  const groups = new Map<number, Package>();
  for (const item of order.items) {
    const group = groups.get(item.companyId) ?? {
      companyId: item.companyId,
      companyName: item.companyName,
      status: OrderStatus.Cancelled,
      items: [],
    };
    group.items.push(item);
    groups.set(item.companyId, group);
  }
  for (const group of groups.values()) {
    const active = group.items.filter((i) => i.status !== OrderStatus.Cancelled);
    group.status = active.length
      ? (Math.min(...active.map((i) => i.status)) as OrderStatus)
      : OrderStatus.Cancelled;
  }
  return [...groups.values()];
}

function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const justPlaced = (location.state as { placed?: boolean } | null)?.placed === true;
  const { user, hasRole } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    ordersApi
      .getById(Number(id))
      .then(setOrder)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  const packages = useMemo(() => (order ? toPackages(order) : []), [order]);

  if (loading) return <LoadingState />;
  if (order === null) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <ErrorAlert message={error || "Order not found."} />
      </Container>
    );
  }

  const isAdmin = hasRole(Role.Admin);
  const isSeller = hasRole(Role.Seller);
  const isOwner = order.customerEmail === user?.email;

  async function handleCancel() {
    if (!window.confirm("Cancel the whole order?")) return;
    setCancelling(true);
    try {
      setOrder(await ordersApi.cancel(order!.id));
      setError("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCancelling(false);
    }
  }

  const backLink = isAdmin ? "/admin/orders" : isSeller ? "/seller/orders" : "/orders";

  return (
    <Box className="orders-page">
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Button component={Link} to={backLink} startIcon={<ArrowBackIcon />} sx={{ mb: 2, px: 1 }}>
          Back to orders
        </Button>

        {justPlaced && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you! Your order {order.number} has been placed. You can follow it on this page.
          </Alert>
        )}
        <ErrorAlert message={error} />

        <Box className="order-card-header" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" className="orders-title" sx={{ mb: "4px !important" }}>
              Order {order.number}
            </Typography>
            <Typography className="order-meta">Placed on {formatDate(order.createdAt)}</Typography>
          </Box>
          <Chip label={ORDER_STATUS_LABELS[order.status]} color={ORDER_STATUS_COLORS[order.status]} />
        </Box>

        {order.status === OrderStatus.Cancelled ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            This order was cancelled. If you paid by card, the money is returned within 5 working days.
          </Alert>
        ) : (
          <Stepper
            activeStep={order.status === OrderStatus.Delivered ? STEPS.length : STEPS.indexOf(order.status) + 1}
            alternativeLabel
            className="order-stepper"
          >
            {STEPS.map((step) => (
              <Step key={step}>
                <StepLabel>{ORDER_STATUS_LABELS[step]}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        <Box className="order-details-grid">
          <Box>
            {packages.map((pkg, index) => (
              <Box key={pkg.companyId} className="order-box">
                <Box className="order-package-header">
                  <Typography className="order-package-seller">
                    {packages.length > 1 && `Package ${index + 1} · `}Sold and shipped by {pkg.companyName}
                  </Typography>
                  <Chip
                    size="small"
                    label={ORDER_STATUS_LABELS[pkg.status]}
                    color={ORDER_STATUS_COLORS[pkg.status]}
                  />
                </Box>
                {pkg.items.map((item) => (
                  <Box
                    key={item.id}
                    className={`order-line${item.status === OrderStatus.Cancelled ? " order-line--cancelled" : ""}`}
                  >
                    <img src={item.imageUrl} alt={item.productName} className="order-thumb" />
                    <Typography className="order-line-name">
                      {item.productId === null ? (
                        item.productName
                      ) : (
                        <Link to={`/products/${item.productId}`} className="order-line-link">
                          {item.productName}
                        </Link>
                      )}
                      <br />
                      <span className="order-meta">
                        {item.quantity} × {money(item.unitPrice)}
                      </span>
                    </Typography>
                    <Typography className="order-line-price">{money(item.lineTotal)}</Typography>
                  </Box>
                ))}
                {(isAdmin || isSeller) && (
                  <Box sx={{ mt: 1.5 }}>
                    <PackageActions
                      orderId={order.id}
                      status={pkg.status}
                      companyId={isAdmin ? pkg.companyId : undefined}
                      onUpdated={setOrder}
                      onError={setError}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          <Box>
            <Box className="order-box">
              <Typography className="order-box-title">Delivery</Typography>
              <Typography className="order-text">
                {order.shippingFullName} · {order.shippingPhone}
                <br />
                {order.shippingAddress}
                <br />
                {order.shippingCity}, {order.shippingCounty}, {order.shippingPostalCode}
                {order.notes && (
                  <>
                    <br />
                    Note: {order.notes}
                  </>
                )}
              </Typography>
            </Box>

            <Box className="order-box">
              <Typography className="order-box-title">Payment</Typography>
              <Typography className="order-text" sx={{ mb: 1.5 }}>
                {paymentLabel(order)}
              </Typography>
              <Box className="order-sum-row">
                <span>Subtotal</span>
                <span>{money(order.subtotal)}</span>
              </Box>
              {order.appliedPromotions.map((p) => (
                <Box key={p.name} className="order-sum-row order-sum-row--discount">
                  <span>{p.name}</span>
                  <span>-{money(p.discount)}</span>
                </Box>
              ))}
              {!isSeller && (
                <Box className="order-sum-row">
                  <span>Delivery</span>
                  <span>{order.shippingCost === 0 ? "Free" : money(order.shippingCost)}</span>
                </Box>
              )}
              <Box className="order-sum-row order-sum-row--total">
                <span>{isSeller ? "Your share" : "Total"}</span>
                <span>{money(order.total)}</span>
              </Box>
            </Box>

            {isOwner && order.canCancel && (
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleCancel}
                disabled={cancelling}
              >
                Cancel order
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default OrderDetails;
