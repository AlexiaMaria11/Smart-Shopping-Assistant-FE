import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckIcon from "@mui/icons-material/Check";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../shared/types/Product";
import { useCart } from "../../../context/CartContext/cart-context";
import { useFavorites } from "../../../context/FavoritesContext/favorites-context";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  hideSeller?: boolean;
}

function ProductCard({ product, hideSeller = false }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(product.id);

  async function handleAddToCart() {
    if (!(await addItem(product.id, 1))) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Card sx={{ display: "flex", flexDirection: "column" }}>
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
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          {fav ? (
            <FavoriteIcon fontSize="small" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography className="product-card-name">{product.name}</Typography>
        {!hideSeller && product.companySlug && (
          <Link
            to={`/sellers/${product.companySlug}`}
            className="product-card-seller"
          >
            <StorefrontOutlinedIcon className="product-card-seller-icon" />
            {product.companyName}
          </Link>
        )}
        {product.description && (
          <Typography className="product-card-desc">
            {product.description}
          </Typography>
        )}
        <Box className="product-card-divider" />
        <Box className="product-card-price-row">
          <Typography className="price-tag">{product.price}</Typography>
          <Typography className="product-card-currency">RON</Typography>
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
              <AddShoppingCartIcon sx={{ fontSize: "1rem !important" }} />
            )
          }
          onClick={() => !added && handleAddToCart()}
          className="shop-add-btn"
          aria-label={`Add ${product.name} to cart`}
        >
          {added ? "Added!" : "Add to Cart"}
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
