import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ordersApi } from "../../api/clients/OrderApiClient";
import { money } from "../shared/types/Order";
import type { SellerStats } from "../shared/types/Stats";
import ErrorAlert from "../common/ErrorAlert";
import LoadingState from "../common/LoadingState";
import "../common/DashboardStats.css";
import "./SellerDashboard.css";

function SellerDashboard() {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .getSellerStats()
      .then(setStats)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box className="seller-dashboard-page">
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h4" className="seller-dashboard-title">
          Dashboard
        </Typography>
        <ErrorAlert message={error} />

        {loading ? (
          <LoadingState />
        ) : stats ? (
          <>
            <Box className="dashboard-stat-row">
              <Box className="dashboard-stat-card">
                <Typography className="dashboard-stat-label">Today</Typography>
                <Typography className="dashboard-stat-figure">{money(stats.today.revenue)}</Typography>
                <Typography className="dashboard-stat-sub">
                  {stats.today.orderCount} {stats.today.orderCount === 1 ? "order" : "orders"}
                </Typography>
              </Box>
              <Box className="dashboard-stat-card">
                <Typography className="dashboard-stat-label">Last 30 days</Typography>
                <Typography className="dashboard-stat-figure">{money(stats.last30Days.revenue)}</Typography>
                <Typography className="dashboard-stat-sub">
                  {stats.last30Days.orderCount} {stats.last30Days.orderCount === 1 ? "order" : "orders"}
                </Typography>
              </Box>
              <Box className="dashboard-stat-card">
                <Typography className="dashboard-stat-label">All time</Typography>
                <Typography className="dashboard-stat-figure">{money(stats.allTime.revenue)}</Typography>
                <Typography className="dashboard-stat-sub">
                  {stats.allTime.orderCount} {stats.allTime.orderCount === 1 ? "order" : "orders"}
                </Typography>
              </Box>
            </Box>

            <Typography className="dashboard-section-title">Top products</Typography>
            {stats.topProducts.length === 0 ? (
              <Typography className="dashboard-empty">No sales yet.</Typography>
            ) : (
              <Box className="dashboard-rank-list">
                {stats.topProducts.map((product, index) => (
                  <Box key={`${product.productId}-${product.productName}`} className="dashboard-rank-row">
                    <Typography className="dashboard-rank-index">{index + 1}</Typography>
                    <Typography className="dashboard-rank-name">{product.productName}</Typography>
                    <Typography className="dashboard-rank-qty">× {product.quantitySold}</Typography>
                    <Typography className="dashboard-rank-revenue">{money(product.revenue)}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </>
        ) : null}
      </Container>
    </Box>
  );
}

export default SellerDashboard;
