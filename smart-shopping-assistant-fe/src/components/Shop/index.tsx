import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "../shared/types/Product";
import { productsApi } from "../../api/clients/ProductApiClient";
import { useCart } from "../../context/CartContext/cart-context";
import { useFavorites } from "../../context/FavoritesContext/favorites-context";
import "./Shop.css";

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

function ShopSkeleton() {
  return (
    <Box className="shop-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <Box key={i} className="shop-skeleton-card">
          <Skeleton variant="rectangular" height={190} />
          <Box sx={{ p: 2.5 }}>
            <Skeleton variant="text" width="70%" height={24} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [userPriceRange, setUserPriceRange] = useState<[number, number] | null>(null);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const { addItem } = useCart();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();

  const allCategories = useMemo(() => {
    const map = new Map<number, string>();
    products.forEach((p) =>
      p.categories.forEach((c) => map.set(c.id, c.name)),
    );
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

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
    () =>
      preFilteredProducts.length
        ? Math.floor(Math.min(...preFilteredProducts.map((p) => p.price)))
        : 0,
    [preFilteredProducts],
  );
  const priceMax = useMemo(
    () =>
      preFilteredProducts.length
        ? Math.ceil(Math.max(...preFilteredProducts.map((p) => p.price)))
        : 10000,
    [preFilteredProducts],
  );

  const priceRange = useMemo<[number, number]>(
    () =>
      userPriceRange
        ? [
            Math.max(priceMin, userPriceRange[0]),
            Math.min(priceMax, userPriceRange[1]),
          ]
        : [priceMin, priceMax],
    [userPriceRange, priceMin, priceMax],
  );

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
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1800);
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

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] !== priceMin ||
    priceRange[1] !== priceMax;

  return (
    <Box className="shop-page">
      <Container maxWidth="xl" sx={{ pt: 5, pb: 6 }}>
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
              className="shop-search"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="shop-search-icon" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <FormControl size="small" className="shop-sort">
              <InputLabel>Sort by</InputLabel>
              <Select
                label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="name-asc">Name: A → Z</MenuItem>
                <MenuItem value="name-desc">Name: Z → A</MenuItem>
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
                        />
                      }
                    />
                  ))}
                </FormGroup>
              </Box>
            )}

            <Box className="sidebar-section">
              <Typography className="sidebar-label">Price</Typography>
              <Slider
                value={priceRange}
                onChange={(_, val) => setUserPriceRange(val as [number, number])}
                min={priceMin}
                max={priceMax}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v} RON`}
              />
              <Box className="price-range-labels">
                <Typography className="price-range-value">
                  {priceRange[0]} RON
                </Typography>
                <Typography className="price-range-value">
                  {priceRange[1]} RON
                </Typography>
              </Box>
            </Box>

            {hasActiveFilters && (
              <Button
                variant="outlined"
                size="small"
                fullWidth
                className="shop-clear-btn"
                onClick={() => {
                  setSelectedCategories([]);
                  setUserPriceRange(null);
                }}
              >
                Clear filters
              </Button>
            )}
          </Box>

          <Box className="shop-main">
            {loading ? (
              <ShopSkeleton />
            ) : visibleProducts.length === 0 ? (
              <Box className="shop-empty">
                <Box className="shop-empty-icon">
                  <StorefrontIcon className="shop-empty-icon-svg" />
                </Box>
                <Typography className="shop-empty-title">
                  No products found
                </Typography>
                <Typography className="shop-empty-subtitle">
                  Try adjusting your search or filters.
                </Typography>
                {hasActiveFilters && (
                  <Button
                    variant="outlined"
                    size="small"
                    className="shop-clear-btn"
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setSelectedCategories([]);
                      setUserPriceRange(null);
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </Box>
            ) : (
              <Box className="shop-grid">
                {visibleProducts.map((product) => {
                  const added = addedIds.has(product.id);
                  const fav = isFavorite(product.id);
                  return (
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
                        <IconButton
                          className={`product-fav-btn${fav ? " product-fav-btn--active" : ""}`}
                          size="small"
                          onClick={() => toggleFavorite(product.id)}
                          aria-label={
                            fav
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          {fav ? (
                            <FavoriteIcon fontSize="small" />
                          ) : (
                            <FavoriteBorderIcon fontSize="small" />
                          )}
                        </IconButton>
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
                          color={added ? "success" : "primary"}
                          startIcon={
                            added ? (
                              <CheckIcon sx={{ fontSize: "1rem !important" }} />
                            ) : (
                              <AddShoppingCartIcon
                                sx={{ fontSize: "1rem !important" }}
                              />
                            )
                          }
                          onClick={() =>
                            !added && handleAddToCart(product)
                          }
                          className="shop-add-btn"
                          aria-label={`Add ${product.name} to cart`}
                        >
                          {added ? "Added!" : "Add to Cart"}
                        </Button>
                      </CardActions>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Shop;
