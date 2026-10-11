import { Box, Button, Container, Skeleton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { productsApi } from "../../api/clients/ProductApiClient";
import type { Product } from "../shared/types/Product";
import ProductCard from "../common/ProductCard";
import "./Home.css";

// How many products the shelf strip shows. Four fills one row on a wide screen
// and wraps to two on a tablet without leaving a gap.
const SHELF_SIZE = 4;

// Every claim below has to be traceable to PRODUCT.md Capabilities. The lead one
// is the platform's own mechanic; the two beside it support it.
const LEAD = {
  title: "One order, several shops",
  body: "Fill one basket from as many sellers as you like and pay once. The order then splits into a package per shop, each with its own track — confirmed, shipped, delivered. One package running late never holds up the rest, and you can cancel one without losing the others.",
};

const SUPPORTING = [
  {
    title: "Promotions apply themselves",
    body: "No codes to hunt for. A discount that applies to your basket is already in the total you see.",
  },
  {
    title: "Every shop in the open",
    body: "Each product names the company behind it, and every company has a page of its own. You always know who you are buying from.",
  },
];

// The four package states a shop moves through, drawn once so the lead claim is
// shown rather than asserted
const PACKAGE_STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"];

function Shelf() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    productsApi
      .getAll()
      .then((all) => {
        // One product per shop where possible, so the strip shows the marketplace
        // rather than four things from whoever was seeded first
        const bySeller = new Map<number, Product>();
        for (const product of all) {
          if (product.stockQuantity > 0 && !bySeller.has(product.companyId)) {
            bySeller.set(product.companyId, product);
          }
        }
        const picked = [...bySeller.values()];
        const rest = all.filter(
          (p) => p.stockQuantity > 0 && !picked.includes(p),
        );
        setProducts([...picked, ...rest].slice(0, SHELF_SIZE));
      })
      .catch(() => setFailed(true));
  }, []);

  // The shop still works without the shelf, so a failure shows nothing at all
  // rather than an error the visitor can do nothing about
  if (failed || products?.length === 0) return null;

  return (
    <Box
      className="home-shelf"
      component="section"
      aria-labelledby="home-shelf-title"
    >
      <Container maxWidth="lg">
        <Box className="home-shelf-head">
          <Typography
            variant="h2"
            className="home-section-title"
            id="home-shelf-title"
          >
            From the shop
          </Typography>
          <Link to="/shop" className="home-shelf-all">
            See the whole catalogue
          </Link>
        </Box>

        <Box className="home-shelf-grid">
          {products === null
            ? Array.from({ length: SHELF_SIZE }).map((_, i) => (
                <Box key={i} className="home-shelf-skeleton">
                  <Skeleton variant="rectangular" height={190} />
                  <Box sx={{ p: 2.5 }}>
                    <Skeleton variant="text" width="70%" height={24} />
                    <Skeleton variant="text" width="45%" />
                    <Skeleton variant="text" width="100%" />
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={32}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </Box>
      </Container>
    </Box>
  );
}

function Home() {
  return (
    <Box>
      <Box className="home-hero" component="section">
        <Container maxWidth="lg">
          <Box className="home-hero-inner">
            <Typography variant="h1" className="home-hero-title">
              Many shops,
              <br />
              <em>one basket</em>
            </Typography>

            <Box className="home-accent-rule" aria-hidden="true">
              <Box className="home-accent-line home-accent-line--left" />
              <Box className="home-accent-diamond" />
              <Box className="home-accent-line home-accent-line--right" />
            </Box>

            <Typography className="home-hero-subtitle">
              Independent sellers, one catalogue. Buy from several of them at
              once, pay once, and follow each shop's package on its own way to
              you.
            </Typography>

            <Button
              component={Link}
              to="/shop"
              variant="contained"
              color="primary"
              size="large"
              className="home-cta"
            >
              Browse products
            </Button>
          </Box>
        </Container>
      </Box>

      <Shelf />

      <Box
        className="home-how"
        component="section"
        aria-labelledby="home-how-title"
      >
        <Container maxWidth="lg">
          <Box className="home-lead">
            <Box className="home-lead-text">
              <Typography
                variant="h2"
                className="home-section-title"
                id="home-how-title"
              >
                {LEAD.title}
              </Typography>
              <Typography className="home-lead-body">{LEAD.body}</Typography>
            </Box>

            <Box className="home-split" aria-hidden="true">
              <Box className="home-split-order">1 order</Box>
              <Box className="home-split-fan">
                {["Books & Co.", "TechNova", "Verde"].map((shop, index) => (
                  <Box key={shop} className="home-split-package">
                    <span className="home-split-shop">{shop}</span>
                    <span className="home-split-state">
                      {PACKAGE_STEPS[index + 1]}
                    </span>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box className="home-supporting">
            {SUPPORTING.map((item) => (
              <Box key={item.title} className="home-support">
                <Typography variant="h3" className="home-support-title">
                  {item.title}
                </Typography>
                <Typography className="home-support-body">
                  {item.body}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Box className="home-close" component="section">
        <Container maxWidth="sm">
          <Typography variant="h2" className="home-close-title">
            Start with the catalogue
          </Typography>
          <Button
            component={Link}
            to="/shop"
            variant="contained"
            color="primary"
            size="large"
            className="home-cta"
          >
            Browse products
          </Button>
          <Typography className="home-close-sell">
            Have something to sell? Open your own store on Smart Shop — your
            products, your stock, your promotions, and your own packages to
            ship. New stores are reviewed before they go live.{" "}
            <Link to="/register/seller" className="home-sell-link">
              Open a store
            </Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
