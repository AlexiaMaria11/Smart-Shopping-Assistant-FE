import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckIcon from "@mui/icons-material/Check";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "../shared/types/Product";
import { productsApi } from "../../api/clients/ProductApiClient";
import { useCart } from "../../context/CartContext/cart-context";
import { useFavorites } from "../../context/FavoritesContext/favorites-context";
import "./Favorites.css";

function Favorites() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const { addItem } = useCart();
  const { favorites, isFavorite, toggle } = useFavorites();

  useEffect(() => {
    productsApi
      .getAll()
      .then(setAllProducts)
      .finally(() => setLoading(false));
  }, []);

  const favoriteProducts = useMemo(
    () => allProducts.filter((p) => favorites.has(p.id)),
    [allProducts, favorites],
  );

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
            {favoriteProducts.map((product) => {
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
                      onClick={() => toggle(product.id)}
                      aria-label={
                        fav ? "Remove from favorites" : "Add to favorites"
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
                      onClick={() => !added && handleAddToCart(product)}
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
      </Container>
    </Box>
  );
}

export default Favorites;
