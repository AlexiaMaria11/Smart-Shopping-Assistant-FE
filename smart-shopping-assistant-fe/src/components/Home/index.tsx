import { Box, Button, Container, Skeleton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { productsApi } from "../../api/clients/ProductApiClient";
import type { Product } from "../shared/types/Product";
import ProductLook from "../common/ProductLook";
import "./Home.css";

// How many pieces the shelf strip shows. Four fills one row on a wide screen
// and wraps to two on a tablet without leaving a gap.
const SHELF_SIZE = 4;

// Every claim below has to be traceable to PRODUCT.md Capabilities. The lead one
// is the platform's own mechanic; the two beside it support it.
const LEAD = {
  title: "One order, several houses",
  body: "Choose pieces from as many houses as you like and pay once. The order then splits into a package per house, each with its own track — confirmed, shipped, delivered. One package running late never holds up the rest, and you can cancel one without losing the others.",
};

const SUPPORTING = [
  {
    title: "Promotions apply themselves",
    body: "No codes to hunt for. A discount that applies to your order is already in the total you see.",
  },
  {
    title: "Every house in the open",
    body: "Each piece names the house behind it, and every house has a page of its own. You always know whose collection you are buying from.",
  },
];

// The four package states an order moves through, drawn once so the lead claim
// is shown rather than asserted
const PACKAGE_STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"];

// The three houses seeded into the catalogue (see DataSeeder.Companies.cs),
// used here only to show the split, never as a claim about them.
const DEMO_HOUSES = ["Teilor", "Meli Melo", "Liu Jo"];

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
            From the collection
          </Typography>
          <Link to="/shop" className="home-shelf-all">
            See the whole collection
          </Link>
        </Box>

        <Box className="look-grid">
          {products === null
            ? Array.from({ length: SHELF_SIZE }).map((_, i) => (
                <Box key={i} className="home-shelf-skeleton">
                  <Skeleton variant="rectangular" sx={{ aspectRatio: "4 / 5" }} />
                  <Box sx={{ pt: 1.5 }}>
                    <Skeleton variant="text" width="70%" height={22} />
                    <Skeleton variant="text" width="45%" />
                  </Box>
                </Box>
              ))
            : products.map((product, index) => (
                <ProductLook key={product.id} product={product} plate={index + 1} />
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
              Several houses,
              <br />
              <em>one collection</em>
            </Typography>

            <Box className="home-accent-rule" aria-hidden="true" />

            <Typography className="home-hero-subtitle">
              Designer fashion from independent houses, read as one
              collection. Choose pieces from as many as you like, pay once,
              and follow each house's package on its own way to you.
            </Typography>

            <Button
              component={Link}
              to="/shop"
              variant="contained"
              color="primary"
              size="large"
              className="home-cta"
            >
              View the collection
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
                {DEMO_HOUSES.map((house, index) => (
                  <Box key={house} className="home-split-package">
                    <span className="home-split-house">{house}</span>
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
            Start with the collection
          </Typography>
          <Button
            component={Link}
            to="/shop"
            variant="contained"
            color="primary"
            size="large"
            className="home-cta"
          >
            View the collection
          </Button>
          <Typography className="home-close-sell">
            Have a house of your own? Open your store on Maison — your
            pieces, your stock, your promotions, and your own packages to
            ship. New houses are reviewed before they go live.{" "}
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
