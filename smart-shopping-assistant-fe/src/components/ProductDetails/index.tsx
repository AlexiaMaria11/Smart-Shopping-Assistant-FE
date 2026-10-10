import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productsApi } from "../../api/clients/ProductApiClient";
import { promotionsApi } from "../../api/clients/PromotionApiClient";
import {
  galleryOf,
  LOW_STOCK_THRESHOLD,
  type Product,
} from "../shared/types/Product";
import {
  promotionDescription,
  type Promotion,
} from "../shared/types/Promotion";
import { useCart } from "../../context/CartContext/cart-context";
import { useFavorites } from "../../context/FavoritesContext/favorites-context";
import ErrorAlert from "../common/ErrorAlert";
import LoadingState from "../common/LoadingState";
import ProductCard from "../common/ProductCard";
import ProductGallery from "./ProductGallery";
import "./ProductDetails.css";
import "../Shop/Shop.css";

// Everything that was loaded for one product id. Keeping the id next to the data means
// moving to another product never shows the previous one while the new one is loading.
interface Loaded {
  productId: number;
  product: Product | null;
  error: string;
  promotions: Promotion[];
  similar: Product[];
}

function ProductDetails() {
  const { id = "" } = useParams();
  const productId = Number(id);
  const validId = Number.isInteger(productId) && productId > 0;

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [chosenQuantity, setChosenQuantity] = useState<{ productId: number; value: number } | null>(null);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [cartError, setCartError] = useState("");

  const { addItem } = useCart();
  const { isFavorite, toggle } = useFavorites();

  const current = loaded !== null && loaded.productId === productId ? loaded : null;
  const quantity =
    chosenQuantity !== null && chosenQuantity.productId === productId ? chosenQuantity.value : 1;

  useEffect(() => {
    if (!validId) return;

    // The promotions and the similar products are extras: the page is still useful
    // without them, so a failure there is not shown as an error
    Promise.all([
      productsApi.getById(productId).then(
        (product) => ({ product, error: "" }),
        (err: Error) => ({ product: null, error: err.message }),
      ),
      promotionsApi.getForProduct(productId).catch(() => []),
      productsApi.getSimilar(productId, 4).catch(() => []),
    ]).then(([result, promotions, similar]) =>
      setLoaded({
        productId,
        product: result.product,
        error: result.error,
        promotions: promotions.filter((promotion) => promotion.isActive),
        similar,
      }),
    );
  }, [productId, validId]);

  const product = current?.product ?? null;
  const promotions = current?.promotions ?? [];
  const similar = current?.similar ?? [];
  const images = useMemo(() => (product ? galleryOf(product) : []), [product]);

  if (validId && current === null) return <LoadingState />;

  if (product === null) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Button component={Link} to="/shop" startIcon={<ArrowBackIcon />} sx={{ mb: 2, px: 1 }}>
          Back to shop
        </Button>
        <ErrorAlert
          message={current?.error || (validId ? "Product not found." : "This product does not exist.")}
        />
      </Container>
    );
  }

  const outOfStock = product.stockQuantity <= 0;
  const lowStock = !outOfStock && product.stockQuantity <= LOW_STOCK_THRESHOLD;
  const maxQuantity = Math.max(product.stockQuantity, 1);
  const fav = isFavorite(product.id);

  async function handleAddToCart() {
    setAdding(true);
    try {
      if (!(await addItem(product!.id, quantity))) return;
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      setCartError((err as Error).message);
    } finally {
      setAdding(false);
    }
  }

  return (
    <Box className="product-page">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button component={Link} to="/shop" startIcon={<ArrowBackIcon />} sx={{ mb: 2, px: 1 }}>
          Back to shop
        </Button>

        <Box className="product-detail-grid">
          <ProductGallery key={product.id} images={images} productName={product.name} />

          <Box>
            <Typography variant="h4" className="product-detail-name">
              {product.name}
            </Typography>

            {product.companySlug && (
              <Link to={`/sellers/${product.companySlug}`} className="product-detail-seller">
                <StorefrontOutlinedIcon sx={{ fontSize: 17 }} />
                Sold by {product.companyName}
              </Link>
            )}

            <Box className="product-detail-price-row">
              <Typography className="product-detail-price">
                {product.price.toFixed(2)}
              </Typography>
              <Typography className="product-detail-currency">RON</Typography>
            </Box>

            <Box className="product-detail-stock">
              <Inventory2OutlinedIcon sx={{ fontSize: 17 }} />
              {outOfStock ? (
                <span className="product-detail-stock--out">Out of stock</span>
              ) : lowStock ? (
                <span className="product-detail-stock--low">
                  Only {product.stockQuantity} left in stock
                </span>
              ) : (
                <span className="product-detail-stock--in">
                  In stock · {product.stockQuantity} available
                </span>
              )}
            </Box>

            <Box className="product-detail-buy">
              <TextField
                label="Quantity"
                type="number"
                size="small"
                value={quantity}
                disabled={outOfStock}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!Number.isInteger(value)) return;
                  setChosenQuantity({
                    productId,
                    value: Math.min(Math.max(value, 1), maxQuantity),
                  });
                }}
                className="product-detail-qty"
                slotProps={{ htmlInput: { min: 1, max: maxQuantity, step: 1 } }}
              />
              <Button
                variant="contained"
                color={added ? "success" : "primary"}
                disabled={outOfStock || adding}
                startIcon={added ? <CheckIcon /> : <AddShoppingCartIcon />}
                onClick={handleAddToCart}
                className="product-detail-add"
              >
                {outOfStock ? "Out of stock" : added ? "Added to cart!" : "Add to cart"}
              </Button>
              <IconButton
                onClick={() => toggle(product.id)}
                aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                className={`product-detail-fav${fav ? " product-detail-fav--active" : ""}`}
              >
                {fav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            {promotions.length > 0 && (
              <Box className="product-detail-promos">
                <Typography className="product-detail-section-label">
                  Offers on this product
                </Typography>
                {promotions.map((promotion) => (
                  <Box key={promotion.id} className="product-promo">
                    <LocalOfferOutlinedIcon className="product-promo-icon" />
                    <Box>
                      <Typography className="product-promo-name">{promotion.name}</Typography>
                      <Typography className="product-promo-rule">
                        {promotionDescription(promotion)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {product.categories.length > 0 && (
              <Box className="product-detail-categories">
                {product.categories.map((category) => (
                  <Chip key={category.id} label={category.name} size="small" variant="outlined" />
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {product.description && (
          <Box className="product-detail-description">
            <Typography className="product-detail-section-title">Description</Typography>
            <Typography className="product-detail-description-text">
              {product.description}
            </Typography>
          </Box>
        )}

        {similar.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Typography className="product-detail-section-title">
              You may also like
            </Typography>
            <Box className="shop-grid">
              {similar.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </Box>
          </Box>
        )}
      </Container>

      <Snackbar
        open={cartError !== ""}
        autoHideDuration={4000}
        onClose={() => setCartError("")}
        message={cartError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

export default ProductDetails;
