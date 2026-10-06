import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import "./Home.css";

const features = [
  {
    icon: <StorefrontIcon className="home-feature-icon-svg" />,
    title: "Curated products",
    description:
      "Every product in the catalog goes through a selection process before it reaches you.",
  },
  {
    icon: <LocalOfferIcon className="home-feature-icon-svg" />,
    title: "Promotions applied automatically",
    description:
      "No hunting for codes. Valid discounts apply themselves at checkout.",
  },
  {
    icon: <TrendingUpIcon className="home-feature-icon-svg" />,
    title: "Fair prices",
    description:
      "We track prices and always show you the best available option.",
  },
];

function Home() {
  return (
    <Box>
      <Box className="home-hero">
        <Container maxWidth="lg">
          <Box className="home-hero-inner">
            <Typography variant="h2" className="home-hero-title">
              Smarter shopping,
              <br />
              <em>better choices</em>
            </Typography>

            <Box className="home-accent-rule">
              <Box className="home-accent-line home-accent-line--left" />
              <Box className="home-accent-diamond" />
              <Box className="home-accent-line home-accent-line--right" />
            </Box>

            <Typography className="home-hero-subtitle">
              A catalog of verified products with promotions applied
              automatically. No unnecessary searching.
            </Typography>

            <Button
              component={Link}
              to="/shop"
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 5, py: 1.4, fontSize: "0.96rem" }}
            >
              Browse products
            </Button>

            <Typography className="home-hero-subtitle" sx={{ mt: 3, mb: 0 }}>
              Have something to sell?{" "}
              <Link to="/register/seller" className="home-sell-link">
                Open your store on Smart Shop
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box className="home-features">
        <Container maxWidth="lg">
          <Box className="home-features-head">
            <Typography variant="h3" className="home-features-title">
              Why it works
            </Typography>
            <Box className="home-features-rule">
              <Box className="home-features-rule-line home-features-rule-line--left" />
              <Box className="home-features-rule-diamond" />
              <Box className="home-features-rule-line home-features-rule-line--right" />
            </Box>
          </Box>

          <Box className="home-features-grid">
            {features.map((f) => (
              <Box key={f.title} className="home-feature-card">
                <Box className="home-feature-icon">{f.icon}</Box>
                <Typography className="home-feature-name">{f.title}</Typography>
                <Typography className="home-feature-desc">
                  {f.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
