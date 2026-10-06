import { Box, CircularProgress, Container, Typography } from "@mui/material";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "../shared/types/Product";
import { favoritesApi } from "../../api/clients/FavoritesApiClient";
import ProductCard from "../common/ProductCard";
import { useFavorites } from "../../context/FavoritesContext/favorites-context";
import "./Favorites.css";

function Favorites() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();

  useEffect(() => {
    favoritesApi
      .getProducts()
      .then(setAllProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const favoriteProducts = useMemo(
    () => allProducts.filter((p) => favorites.has(p.id)),
    [allProducts, favorites],
  );

  return (
    <Box className="favorites-page">
      <Container maxWidth="xl" sx={{ pt: 5, pb: 6 }}>
        <Box className="favorites-header">
          <Typography variant="h4" className="favorites-title">
            Favorites
          </Typography>
          {!loading && favoriteProducts.length > 0 && (
            <Typography className="favorites-count">
              {favoriteProducts.length}{" "}
              {favoriteProducts.length === 1 ? "item" : "items"}
            </Typography>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : favoriteProducts.length === 0 ? (
          <Box className="favorites-empty">
            <Box className="favorites-empty-icon">
              <FavoriteOutlinedIcon className="favorites-empty-icon-svg" />
            </Box>
            <Typography className="favorites-empty-title">
              No favorites yet
            </Typography>
            <Typography className="favorites-empty-subtitle">
              Tap the heart on any product to save it here.
            </Typography>
          </Box>
        ) : (
          <Box className="favorites-grid">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Favorites;
