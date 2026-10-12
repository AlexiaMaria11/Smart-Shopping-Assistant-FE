import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormGroup,
  MenuItem,
  Pagination,
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
import { productsApi, type PagedProducts } from "../../api/clients/ProductApiClient";
import { categoriesApi } from "../../api/clients/CategoryApiClient";
import { companiesApi } from "../../api/clients/CompanyApiClient";
import { ProductSortOption } from "../../api/models/ProductModel";
import ProductLook from "../common/ProductLook";
import "./Shop.css";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 350;

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

  // The rail's own option lists and the catalogue's price bounds — fetched
  // once, independently of whatever page or filters are active.
  const [facets, setFacets] = useState<{
    categories: { id: number; name: string }[];
    companies: { id: number; name: string }[];
    priceBounds: [number, number];
  } | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<ProductSortOption>(ProductSortOption.PriceAsc);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [userPriceRange, setUserPriceRange] = useState<[number, number] | null>(null);
  const [page, setPage] = useState(1);

  // Keyed by the exact request that produced it, so "loading" and "result" are
  // both derived from whether the latest request has come back yet, instead
  // of a separate flag that has to be flipped by hand around every fetch.
  const [loaded, setLoaded] = useState<{ key: string; result: PagedProducts } | null>(null);
  const [error, setError] = useState("");

  // The rail's facet lists and price bounds, once
  useEffect(() => {
    Promise.all([categoriesApi.getAll(), companiesApi.getAll(), productsApi.getPriceRange()])
      .then(([categories, companies, priceRange]) => {
        setFacets({
          categories: categories.map((c) => ({ id: c.id, name: c.name })),
          companies: [...companies]
            .map((c) => ({ id: c.id, name: c.name }))
            .sort((a, b) => a.name.localeCompare(b.name)),
          priceBounds: [Math.floor(priceRange.min), Math.ceil(priceRange.max)],
        });
      })
      .catch(() => {});
  }, []);

  // Typing settles before it becomes a request
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [search]);

  const priceRange = useMemo<[number, number] | null>(
    () => userPriceRange ?? (facets ? facets.priceBounds : null),
    [userPriceRange, facets],
  );

  const searchKey = JSON.stringify({
    debouncedSearch,
    selectedCategories,
    selectedCompanies,
    inStockOnly,
    priceRange,
    sortBy,
    page,
  });

  useEffect(() => {
    productsApi
      .search({
        name: debouncedSearch || undefined,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        companyIds: selectedCompanies.length > 0 ? selectedCompanies : undefined,
        inStockOnly: inStockOnly || undefined,
        minPrice: priceRange?.[0],
        maxPrice: priceRange?.[1],
        sort: sortBy,
        page,
        pageSize: PAGE_SIZE,
      })
      .then(
        (result) => {
          setLoaded({ key: searchKey, result });
          setError("");
        },
        (err: Error) => setError(err.message),
      );
    // searchKey is derived from every other dependency listed here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategories, selectedCompanies, inStockOnly, priceRange, sortBy, page]);

  const loading = loaded?.key !== searchKey;
  const result = loaded?.key === searchKey ? loaded.result : null;

  function resetToFirstPage() {
    setPage(1);
  }

  const handleCategoryToggle = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
    resetToFirstPage();
  };

  const handleCompanyToggle = (id: number) => {
    setSelectedCompanies((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
    resetToFirstPage();
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedCompanies.length > 0 ||
    inStockOnly ||
    userPriceRange !== null ||
    debouncedSearch !== "";

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCategories([]);
    setSelectedCompanies([]);
    setInStockOnly(false);
    setUserPriceRange(null);
    resetToFirstPage();
  }

  // Each page is its own sheet: it opens on one piece, the first that can
  // still be bought, and the rest of that page follows it. The folio renumbers
  // from 01 on every page, because it describes the sheet, not the catalogue.
  const { leadLook, followingLooks } = useMemo(() => {
    const items = result?.items ?? [];
    if (items.length === 0) {
      return { leadLook: undefined, followingLooks: [] as Product[] };
    }
    const first = items.findIndex((p) => p.stockQuantity > 0);
    const leadIndex = first === -1 ? 0 : first;
    return {
      leadLook: items[leadIndex],
      followingLooks: items.filter((_, i) => i !== leadIndex),
    };
  }, [result]);

  const totalCount = result?.totalCount ?? 0;
  const totalPages = result?.totalPages ?? 0;

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
                  : totalCount === 0
                    ? "Nothing here matches these filters"
                    : `${totalCount} ${totalCount === 1 ? "piece" : "pieces"}`}
              </Typography>
            </Box>

            {facets && facets.categories.length > 0 && (
              <Box className="lookbook-contents" component="nav" aria-label="Collection sections">
                {facets.categories.map((cat) => (
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

            {facets && facets.companies.length > 0 && (
              <Box className="lookbook-houses" component="nav" aria-label="Houses in this collection">
                <Typography className="lookbook-houses-label">Houses</Typography>
                <Box className="lookbook-houses-list">
                  {facets.companies.map((company) => (
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
              onChange={(e) => {
                setSearch(e.target.value);
                resetToFirstPage();
              }}
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
                onChange={(e) => {
                  setSortBy(e.target.value as ProductSortOption);
                  resetToFirstPage();
                }}
                aria-label="Sort the collection"
              >
                <MenuItem value={ProductSortOption.PriceAsc}>Price ascending</MenuItem>
                <MenuItem value={ProductSortOption.PriceDesc}>Price descending</MenuItem>
                <MenuItem value={ProductSortOption.NameAsc}>Name A-Z</MenuItem>
                <MenuItem value={ProductSortOption.NameDesc}>Name Z-A</MenuItem>
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

              {facets && facets.categories.length > 0 && (
                <Box className="rail-section">
                  <Typography className="rail-label">Categories</Typography>
                  <FormGroup>
                    {facets.categories.map((cat) => (
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

              {facets && facets.companies.length > 0 && (
                <Box className="rail-section">
                  <Typography className="rail-label">Houses</Typography>
                  <FormGroup>
                    {facets.companies.map((company) => (
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
                      onChange={(e) => {
                        setInStockOnly(e.target.checked);
                        resetToFirstPage();
                      }}
                    />
                  }
                />
              </Box>

              {facets && (
                <Box className="rail-section">
                  <Typography className="rail-label">Price</Typography>
                  <Slider
                    value={priceRange ?? facets.priceBounds}
                    onChange={(_, val) => setUserPriceRange(val as [number, number])}
                    onChangeCommitted={resetToFirstPage}
                    min={facets.priceBounds[0]}
                    max={facets.priceBounds[1]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(v) => `${v} RON`}
                  />
                  <Box className="rail-price-labels">
                    <Typography className="rail-price-value">
                      {(priceRange ?? facets.priceBounds)[0]} RON
                    </Typography>
                    <Typography className="rail-price-value">
                      {(priceRange ?? facets.priceBounds)[1]} RON
                    </Typography>
                  </Box>
                </Box>
              )}

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
            ) : totalCount === 0 ? (
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
            ) : followingLooks.length === 0 && totalPages <= 1 ? (
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

            {!loading && totalPages > 1 && (
              <Box className="lookbook-pagination">
                <Pagination
                  page={page}
                  count={totalPages}
                  onChange={(_, value) => setPage(value)}
                  shape="rounded"
                />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Shop;
