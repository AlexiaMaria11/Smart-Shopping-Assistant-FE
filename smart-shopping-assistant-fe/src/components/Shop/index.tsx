import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "../shared/types/Product";
import { productsApi } from "../../api/clients/ProductApiClient";
import { useCart } from "../../context/CartContext/cart-context";
import "./Shop.css";

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const { addItem } = useCart();

  const allCategories = useMemo(() => {
    const map = new Map<number, string>();
    products.forEach((p) =>
      p.categories.forEach((c) => map.set(c.id, c.name)),
    );
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  // Products after search + category filters only (used to compute price bounds)
  const preFilteredProducts = useMemo(() => {
    let result = products.filter((p) =>
      p.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
    );
    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        p.categories.some((c) => selectedCategories.includes(c.id)),
      );
    }
    return result;
  }, [products, search, selectedCategories]);

  const priceMin = useMemo(
    () => (preFilteredProducts.length ? Math.floor(Math.min(...preFilteredProducts.map((p) => p.price))) : 0),
    [preFilteredProducts],
  );
  const priceMax = useMemo(
    () => (preFilteredProducts.length ? Math.ceil(Math.max(...preFilteredProducts.map((p) => p.price))) : 10000),
    [preFilteredProducts],
  );

  useEffect(() => {
    setPriceRange([priceMin, priceMax]);
  }, [priceMin, priceMax]);

  const visibleProducts = useMemo(() => {
    let result = preFilteredProducts.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    result = [...result].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

    return result;
  }, [preFilteredProducts, priceRange, sortBy]);

  const handleAddToCart = async (product: Product) => {
    await addItem(product.id, 1);
  };

  const handleCategoryToggle = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
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

  const checkboxSx = {
    color: "var(--accent)",
    "&.Mui-checked": { color: "var(--primary)" },
    padding: "4px 8px",
  };

  return (
    <Box className="shop-page">
      <Container maxWidth="xl" sx={{ pt: 5, pb: 6 }}>
        {/* Header row: title + search + sort */}
        <Box className="shop-header">
          <Box className="shop-title-row">
            <Typography variant="h4" className="shop-title">
              Shop
            </Typography>
            {products.length > 0 && (
              <Typography className="shop-product-count">
                {visibleProducts.length} / {products.length} products
              </Typography>
            )}
          </Box>

          <Box className="shop-controls-row">
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
                flex: 1,
                maxWidth: 480,
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

            <FormControl
              size="small"
              sx={{
                minWidth: 200,
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
                "& .MuiSelect-select": {
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "0.88rem",
                  color: "var(--text-primary)",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "0.88rem",
                  "&.Mui-focused": { color: "var(--primary)" },
                },
              }}
            >
              <InputLabel>Sort by</InputLabel>
              <Select
                label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <MenuItem value="price-asc" sx={{ fontFamily: '"Poppins", sans-serif', fontSize: "0.88rem" }}>
                  Price: Low to High
                </MenuItem>
                <MenuItem value="price-desc" sx={{ fontFamily: '"Poppins", sans-serif', fontSize: "0.88rem" }}>
                  Price: High to Low
                </MenuItem>
                <MenuItem value="name-asc" sx={{ fontFamily: '"Poppins", sans-serif', fontSize: "0.88rem" }}>
                  Name: A → Z
                </MenuItem>
                <MenuItem value="name-desc" sx={{ fontFamily: '"Poppins", sans-serif', fontSize: "0.88rem" }}>
                  Name: Z → A
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {error !== "" && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        <Box className="shop-body">
          {/* Sidebar filters */}
          <Box className="shop-sidebar">
            <Typography className="sidebar-section-title">Filters</Typography>

            {allCategories.length > 0 && (
              <Box className="sidebar-section">
                <Typography className="sidebar-label">Categories</Typography>
                <FormGroup>
                  {allCategories.map((cat) => (
                    <FormControlLabel
                      key={cat.id}
                      label={cat.name}
                      control={
                        <Checkbox
                          checked={selectedCategories.includes(cat.id)}
                          onChange={() => handleCategoryToggle(cat.id)}
                          sx={checkboxSx}
                        />
                      }
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontFamily: '"Poppins", sans-serif',
                          fontSize: "0.85rem",
                          color: "var(--text-primary)",
                        },
                        marginLeft: 0,
                      }}
                    />
                  ))}
                </FormGroup>
              </Box>
            )}

            <Box className="sidebar-section">
              <Typography className="sidebar-label">Price</Typography>
              <Slider
                value={priceRange}
                onChange={(_, val) => setPriceRange(val as [number, number])}
                min={priceMin}
                max={priceMax}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v} RON`}
                sx={{
                  color: "var(--primary)",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "var(--primary)",
                    border: "2px solid #fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    "&:hover": { boxShadow: "0 0 0 8px rgba(156,93,72,0.16)" },
                  },
                  "& .MuiSlider-track": { backgroundColor: "var(--primary)" },
                  "& .MuiSlider-rail": { backgroundColor: "var(--accent-light)" },
                  "& .MuiSlider-valueLabel": {
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "0.75rem",
                    backgroundColor: "var(--primary)",
                  },
                }}
              />
              <Box className="price-range-labels">
                <Typography className="price-range-value">{priceRange[0]} RON</Typography>
                <Typography className="price-range-value">{priceRange[1]} RON</Typography>
              </Box>
            </Box>

            {(selectedCategories.length > 0 || priceRange[0] !== priceMin || priceRange[1] !== priceMax) && (
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange([priceMin, priceMax]);
                }}
                sx={{
                  mt: 1,
                  borderColor: "var(--accent)",
                  color: "var(--primary)",
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "0.8rem",
                  borderRadius: "50px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "var(--primary)",
                    background: "rgba(156,93,72,0.06)",
                  },
                }}
              >
                Clear filters
              </Button>
            )}
          </Box>

          {/* Products area */}
          <Box className="shop-main">
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
                  Try adjusting your search or filters.
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
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Shop;
