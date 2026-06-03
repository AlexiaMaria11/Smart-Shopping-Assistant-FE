import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "../shared/types/Product";
import { productsApi } from "../../api/clients/ProductApiClient";
import { useCart } from "../../context/CartContext/cart-context";
import "./Shop.css";

function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { addItem } = useCart();

  const visibleProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
    );
  }, [products, search]);

  const handleAddToCart = async (product: Product) => {
    await addItem(product.id, 1);
  };

  function loadProducts() {
    productsApi
      .getAll()
      .then((data) => {
        setProducts(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Box className="shop-page">
      <Container maxWidth="xl" sx={{ pt: 5, pb: 6 }}>
        <Box className="shop-header">
          <Box className="shop-title-row">
            <StorefrontIcon sx={{ color: "var(--accent)", fontSize: 22 }} />
            <Typography variant="h4" className="shop-title">
              Shop
            </Typography>
          </Box>
          {products.length > 0 && (
            <Typography className="shop-product-count">
              {products.length} products available
            </Typography>
          )}
          <TextField
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9A6855", fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              maxWidth: 500,
              display: "block",
              "& .MuiOutlinedInput-root": {
                background: "#ffffff",
                borderRadius: "50px",
                "& fieldset": { borderColor: "var(--border)" },
                "&:hover fieldset": { borderColor: "var(--accent)" },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--primary)",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputBase-input": {
                fontFamily: '"Poppins", sans-serif',
                fontSize: "0.9rem",
                py: 1.2,
              },
            }}
          />
        </Box>

        {error !== "" && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box className="shop-loading">
            <CircularProgress sx={{ color: "var(--primary)" }} />
          </Box>
        ) : visibleProducts.length === 0 ? (
          <Box className="shop-empty">
            <Typography className="shop-empty-title">
              No products found
            </Typography>
            <Typography className="shop-empty-subtitle">
              Try adjusting your search term.
            </Typography>
          </Box>
        ) : (
          <Box className="shop-grid">
            {visibleProducts.map((product) => (
              <Card
                key={product.id}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Box className="card-image-wrap">
                  <CardMedia
                    component="img"
                    height="190"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{ objectFit: "cover" }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography className="product-card-name">
                    {product.name}
                  </Typography>

                  {product.description && (
                    <Typography className="product-card-desc">
                      {product.description}
                    </Typography>
                  )}

                  <Box className="product-card-divider" />

                  <Box className="product-card-price-row">
                    <Typography className="price-tag">
                      {product.price}
                    </Typography>
                    <Typography className="product-card-currency">
                      RON
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2.5, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={
                      <AddShoppingCartIcon
                        sx={{ fontSize: "1rem !important" }}
                      />
                    }
                    onClick={() => handleAddToCart(product)}
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      py: 1.1,
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Shop;
