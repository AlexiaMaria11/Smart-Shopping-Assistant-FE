import { Avatar, Box, Container, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import MailOutlineIcon from "@mui/icons-material/MailOutlined";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { companiesApi } from "../../../api/clients/CompanyApiClient";
import { productsApi } from "../../../api/clients/ProductApiClient";
import type { Company } from "../../shared/types/Company";
import type { Product } from "../../shared/types/Product";
import LoadingState from "../../common/LoadingState";
import ErrorAlert from "../../common/ErrorAlert";
import ProductCard from "../../common/ProductCard";
import "../Sellers.css";
import "../../Shop/Shop.css";

function SellerPage() {
  const { slug = "" } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    companiesApi
      .getBySlug(slug)
      .then(async (data) => {
        setCompany(data);
        setProducts(await productsApi.getAll({ companyId: data.id }));
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingState />;

  if (company === null) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <ErrorAlert message={error || "Seller not found."} />
      </Container>
    );
  }

  return (
    <Box className="sellers-page">
      <Box
        className="seller-hero"
        sx={{ backgroundImage: `url(${company.bannerUrl})` }}
      />
      <Container maxWidth="xl" sx={{ pb: 6 }}>
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
            <Box className="seller-header-links">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="seller-header-link"
                >
                  <LanguageIcon sx={{ fontSize: 16 }} />
                  {company.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {company.contactEmail && (
                <a
                  href={`mailto:${company.contactEmail}`}
                  className="seller-header-link"
                >
                  <MailOutlineIcon sx={{ fontSize: 16 }} />
                  {company.contactEmail}
                </a>
              )}
            </Box>
          </Box>
        </Box>

        {company.description && (
          <Typography className="seller-about">{company.description}</Typography>
        )}

        <Typography className="seller-section-title">
          Products ({products.length})
        </Typography>
        <Box className="shop-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} hideSeller />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default SellerPage;
