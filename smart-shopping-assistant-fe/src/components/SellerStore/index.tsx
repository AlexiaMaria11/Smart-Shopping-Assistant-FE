import { Alert, Avatar, Box, Button, Container, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { companiesApi } from "../../api/clients/CompanyApiClient";
import { useAuth } from "../../context/AuthContext/auth-context";
import { CompanyStatus, type Company } from "../shared/types/Company";
import CompanyFormDialog from "../Companies/CompanyFormDialog";
import ErrorAlert from "../common/ErrorAlert";
import LoadingState from "../common/LoadingState";
import "../Sellers/Sellers.css";

const STATUS_MESSAGES: Record<CompanyStatus, { severity: "info" | "success" | "error" | "warning"; text: string }> = {
  [CompanyStatus.Pending]: {
    severity: "info",
    text: "Your store is waiting for approval. You can already add products and promotions; customers will see them once an administrator approves the store.",
  },
  [CompanyStatus.Approved]: {
    severity: "success",
    text: "Your store is live. Customers can find your products in the shop.",
  },
  [CompanyStatus.Rejected]: {
    severity: "error",
    text: "Your store registration was rejected. Please contact support@smartshop.ro for details.",
  },
  [CompanyStatus.Suspended]: {
    severity: "warning",
    text: "Your store is temporarily suspended and hidden from customers. Please contact support@smartshop.ro.",
  },
};

function SellerStore() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const { refreshUser } = useAuth();

  const loadCompany = useCallback(() => {
    companiesApi
      .getMine()
      .then((data) => {
        setCompany(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  if (loading) return <LoadingState />;

  if (company === null) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorAlert message={error || "Store not found."} />
      </Container>
    );
  }

  const status = STATUS_MESSAGES[company.status];

  return (
    <Box className="sellers-page">
      <Box
        className="seller-hero"
        sx={{ backgroundImage: company.bannerUrl ? `url(${company.bannerUrl})` : undefined }}
      />
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Box className="seller-header">
          <Avatar
            src={company.logoUrl}
            alt={company.name}
            variant="rounded"
            className="seller-header-logo"
          >
            {company.name[0]}
          </Avatar>
          <Box className="seller-header-info">
            <Typography variant="h4" className="seller-header-name">
              {company.name}
            </Typography>
            <Typography sx={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              {company.productCount} products · {company.commissionPercent}% commission per sale
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => setEditing(true)}
          >
            Edit store details
          </Button>
        </Box>

        <ErrorAlert message={error} />
        <Alert severity={status.severity} sx={{ mb: 3 }}>
          {status.text}
        </Alert>

        <Typography className="seller-about">
          {company.description || "Add a short description so customers know what you sell."}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button component={Link} to="/seller/products" variant="contained" color="primary">
            Manage products
          </Button>
          <Button component={Link} to="/seller/promotions" variant="outlined" color="primary">
            Manage promotions
          </Button>
          {company.status === CompanyStatus.Approved && (
            <Button component={Link} to={`/sellers/${company.slug}`} variant="text">
              See my public page
            </Button>
          )}
        </Box>
      </Container>

      {editing && (
        <CompanyFormDialog
          company={company}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            loadCompany();
            refreshUser().catch(() => {});
          }}
        />
      )}
    </Box>
  );
}

export default SellerStore;
