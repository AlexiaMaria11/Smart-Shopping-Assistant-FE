import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ordersApi } from "../../api/clients/OrderApiClient";
import { money } from "../shared/types/Order";
import type { AdminStats } from "../shared/types/Stats";
import ErrorAlert from "../common/ErrorAlert";
import LoadingState from "../common/LoadingState";
import "../common/DashboardStats.css";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .getAdminStats()
      .then(setStats)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box className="admin-dashboard-page">
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h4" className="admin-dashboard-title">
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

            <Box className="dashboard-two-col">
              <Box>
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
              </Box>

              <Box>
                <Typography className="dashboard-section-title">Top categories</Typography>
                {stats.topCategories.length === 0 ? (
                  <Typography className="dashboard-empty">No sales yet.</Typography>
                ) : (
                  <Box className="dashboard-rank-list">
                    {stats.topCategories.map((category, index) => (
                      <Box key={category.categoryId} className="dashboard-rank-row">
                        <Typography className="dashboard-rank-index">{index + 1}</Typography>
                        <Typography className="dashboard-rank-name">{category.categoryName}</Typography>
                        <Typography className="dashboard-rank-qty">× {category.quantitySold}</Typography>
                        <Typography className="dashboard-rank-revenue">{money(category.revenue)}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </>
        ) : null}
      </Container>
    </Box>
  );
}

export default AdminDashboard;
