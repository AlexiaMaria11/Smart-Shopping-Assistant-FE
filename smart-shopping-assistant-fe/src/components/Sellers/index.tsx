import { Avatar, Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { companiesApi } from "../../api/clients/CompanyApiClient";
import type { Company } from "../shared/types/Company";
import LoadingState from "../common/LoadingState";
import ErrorAlert from "../common/ErrorAlert";
import "./Sellers.css";

function Sellers() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    companiesApi
      .getAll()
      .then(setCompanies)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box className="sellers-page">
      <Container maxWidth="lg" sx={{ pt: 5, pb: 6 }}>
        <Typography variant="h4" className="sellers-title">
          The houses
        </Typography>
        <Typography className="sellers-subtitle">
          Every piece in the collection comes from one of these houses, each
          selling under its own name and shipping its own package.
        </Typography>

        <ErrorAlert message={error} />
        {loading ? (
          <LoadingState />
        ) : (
          <Box className="sellers-grid">
            {companies.map((company) => (
              <Link
                key={company.id}
                to={`/sellers/${company.slug}`}
                className="seller-card"
              >
                <Box
                  className="seller-card-banner"
                  sx={{ backgroundImage: `url(${company.bannerUrl})` }}
                />
                <Avatar
                  src={company.logoUrl}
                  alt={company.name}
                  variant="square"
                  className="seller-card-logo"
                >
                  {company.name[0]}
                </Avatar>
                <Box className="seller-card-body">
                  <Typography className="seller-card-name">{company.name}</Typography>
                  <Typography className="seller-card-desc">
                    {company.description}
                  </Typography>
                  <Typography className="seller-card-meta">
                    {company.productCount}{" "}
                    {company.productCount === 1 ? "piece" : "pieces"}
                  </Typography>
                </Box>
              </Link>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Sellers;
