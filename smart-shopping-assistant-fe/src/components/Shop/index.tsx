import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormGroup,
  MenuItem,
  Select,
  Skeleton,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useMemo, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type { Product } from "../shared/types/Product";
import { productsApi } from "../../api/clients/ProductApiClient";
import ProductLook from "../common/ProductLook";
import "./Shop.css";

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

function ShopSkeleton() {
  return (
    <Box className="sheet">
      {Array.from({ length: 6 }).map((_, i) => (
        <Box key={i} className="look">
          <Skeleton variant="rectangular" sx={{ aspectRatio: "4 / 5" }} />
          <Box sx={{ pt: 1.5 }}>
            <Skeleton variant="text" width="70%" height={22} />
            <Skeleton variant="text" width="45%" />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function Shop() {
  const theme = useTheme();
  // Narrow screens open on the collection, not on a column of checkboxes
  const narrow = useMediaQuery(theme.breakpoints.down("md"));
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [userPriceRange, setUserPriceRange] = useState<[number, number] | null>(null);
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const allCategories = useMemo(() => {
    const map = new Map<number, string>();
    products.forEach((p) =>
      p.categories.forEach((c) => map.set(c.id, c.name)),
    );
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  const allCompanies = useMemo(() => {
    const map = new Map<number, string>();
    products.forEach((p) => map.set(p.companyId, p.companyName));
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
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
    if (selectedCompanies.length > 0) {
      result = result.filter((p) => selectedCompanies.includes(p.companyId));
    }
    if (inStockOnly) {
      result = result.filter((p) => p.stockQuantity > 0);
    }
    return result;
  }, [products, search, selectedCategories, selectedCompanies, inStockOnly]);

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

  const handleCategoryToggle = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleCompanyToggle = (id: number) => {
    setSelectedCompanies((prev) =>
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
    selectedCompanies.length > 0 ||
    inStockOnly ||
    priceRange[0] !== priceMin ||
    priceRange[1] !== priceMax;

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedCompanies([]);
    setInStockOnly(false);
    setUserPriceRange(null);
  }

  // The collection opens on one piece, the first that can still be bought, and
  // the rest of the sheet follows it in order.
  const { leadLook, followingLooks } = useMemo(() => {
    if (visibleProducts.length === 0) {
      return { leadLook: undefined, followingLooks: [] as Product[] };
    }
    const first = visibleProducts.findIndex((p) => p.stockQuantity > 0);
    const leadIndex = first === -1 ? 0 : first;
    return {
      leadLook: visibleProducts[leadIndex],
      followingLooks: visibleProducts.filter((_, i) => i !== leadIndex),
    };
  }, [visibleProducts]);

  const houseCount = useMemo(
    () => new Set(visibleProducts.map((p) => p.companyId)).size,
    [visibleProducts],
  );

  return (
    <Box className="lookbook">
      <Container maxWidth="xl" sx={{ pt: 5, pb: 8 }}>
        <Box className="lookbook-open">
          <Box className="lookbook-head">
            <Box className="lookbook-titleblock">
              <Typography variant="h1" className="lookbook-title">
                Collection
              </Typography>
              <Typography className="lookbook-line">
              {loading
                ? "Opening the collection"
                : visibleProducts.length === 0
                  ? "Nothing here matches these filters"
                  : `${visibleProducts.length} ${visibleProducts.length === 1 ? "piece" : "pieces"} from ${houseCount} ${houseCount === 1 ? "house" : "houses"}`}
              </Typography>
            </Box>

            {allCategories.length > 0 && (
              <Box className="lookbook-contents" component="nav" aria-label="Collection sections">
                {allCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryToggle(cat.id)}
                    aria-pressed={selectedCategories.includes(cat.id)}
                    className={`lookbook-section${selectedCategories.includes(cat.id) ? " lookbook-section--on" : ""}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </Box>
            )}

            {allCompanies.length > 0 && (
              <Box className="lookbook-houses" component="nav" aria-label="Houses in this collection">
                <Typography className="lookbook-houses-label">Houses</Typography>
                <Box className="lookbook-houses-list">
                  {allCompanies.map((company) => (
                    <button
                      key={company.id}
                      type="button"
                      onClick={() => handleCompanyToggle(company.id)}
                      aria-pressed={selectedCompanies.includes(company.id)}
                      className={`lookbook-house${selectedCompanies.includes(company.id) ? " lookbook-house--on" : ""}`}
                    >
                      {company.name}
                    </button>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Box className="lookbook-lead">
            {loading ? (
              <Skeleton variant="rectangular" sx={{ aspectRatio: "4 / 5" }} />
            ) : (
              leadLook !== undefined && (
                <ProductLook product={leadLook} plate={1} lead />
              )
            )}
          </Box>

          <Box className="lookbook-tools">
              <TextField
                placeholder="Search the collection"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="standard"
                className="lookbook-search"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon className="lookbook-search-icon" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <FormControl variant="standard" size="small" className="lookbook-sort">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort the collection"
                >
                  <MenuItem value="price-asc">Price ascending</MenuItem>
                  <MenuItem value="price-desc">Price descending</MenuItem>
                  <MenuItem value="name-asc">Name A-Z</MenuItem>
                  <MenuItem value="name-desc">Name Z-A</MenuItem>
                </Select>
              </FormControl>
            </Box>
        </Box>

        {error !== "" && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box className="lookbook-body">
          <Box className="lookbook-rail">
            <Typography className="rail-title">Filters</Typography>
            <Box component="details" className="rail-disclosure" open={!narrow}>
              <Box component="summary">Narrow the collection</Box>

            {allCategories.length > 0 && (
              <Box className="rail-section">
                <Typography className="rail-label">Categories</Typography>
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

            {allCompanies.length > 0 && (
              <Box className="rail-section">
                <Typography className="rail-label">Houses</Typography>
                <FormGroup>
                  {allCompanies.map((company) => (
                    <FormControlLabel
                      key={company.id}
                      label={company.name}
                      control={
                        <Checkbox
                          checked={selectedCompanies.includes(company.id)}
                          onChange={() => handleCompanyToggle(company.id)}
                        />
                      }
                    />
                  ))}
                </FormGroup>
              </Box>
            )}

            <Box className="rail-section">
              <Typography className="rail-label">Availability</Typography>
              <FormControlLabel
                label="In stock only"
                control={
                  <Checkbox
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                }
              />
            </Box>

            <Box className="rail-section">
              <Typography className="rail-label">Price</Typography>
              <Slider
                value={priceRange}
                onChange={(_, val) => setUserPriceRange(val as [number, number])}
                min={priceMin}
                max={priceMax}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v} RON`}
              />
              <Box className="rail-price-labels">
                <Typography className="rail-price-value">
                  {priceRange[0]} RON
                </Typography>
                <Typography className="rail-price-value">
                  {priceRange[1]} RON
                </Typography>
              </Box>
            </Box>

              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  className="rail-clear"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}
            </Box>
          </Box>

          <Box className="lookbook-main">
            {loading ? (
              <ShopSkeleton />
            ) : visibleProducts.length === 0 ? (
              <Box className="lookbook-empty">
                <Typography className="lookbook-empty-title">
                  Nothing to show under these filters
                </Typography>
                <Typography className="lookbook-empty-text">
                  Try another search, a different house, or a wider price range.
                </Typography>
                {hasActiveFilters && (
                  <Button
                    variant="outlined"
                    size="small"
                    className="rail-clear"
                    sx={{ mt: 2, width: "auto" }}
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                )}
              </Box>
            ) : followingLooks.length === 0 ? (
              <Typography className="lookbook-only">
                This is the only piece in the collection under these filters.
              </Typography>
            ) : (
              <Box className="sheet">
                {followingLooks.map((product, index) => (
                  <ProductLook key={product.id} product={product} plate={index + 2} />
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
