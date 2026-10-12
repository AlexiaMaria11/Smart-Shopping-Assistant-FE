import { Box, IconButton, Snackbar, Typography } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckIcon from "@mui/icons-material/Check";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState } from "react";
import { Link } from "react-router-dom";
import { galleryOf, LOW_STOCK_THRESHOLD, type Product } from "../../shared/types/Product";
import { useCart } from "../../../context/CartContext/cart-context";
import { useFavorites } from "../../../context/FavoritesContext/favorites-context";
import "./ProductLook.css";

interface ProductLookProps {
  product: Product;
  // Position in the collection as it is currently filtered, printed as the
  // plate's folio. It renumbers with the sheet, because it describes the sheet.
  plate?: number;
  // The piece that opens the collection runs wider than the ones that follow it.
  lead?: boolean;
}

// One look in the lookbook: the photograph on the paper, its credits beneath a
// hairline. Pointing at it turns the page to the next photograph of the same
// piece; a piece photographed once holds still rather than faking a second view.
function ProductLook({ product, plate, lead = false }: ProductLookProps) {
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const { addItem } = useCart();
  const { isFavorite, toggle } = useFavorites();

  const fav = isFavorite(product.id);
  const outOfStock = product.stockQuantity <= 0;
  const lowStock = !outOfStock && product.stockQuantity <= LOW_STOCK_THRESHOLD;
  const gallery = galleryOf(product);
  const turn = gallery.length > 1 ? gallery[1] : null;

  async function handleAdd() {
    try {
      if (!(await addItem(product.id, 1))) return;
    } catch (err) {
      setError((err as Error).message);
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Box
      className={`look${lead ? " look--lead" : ""}${outOfStock ? " look--gone" : ""}`}
    >
      <Box className="look-frame">
        <Link to={`/products/${product.id}`} className="look-link" aria-label={product.name}>
          <img src={product.imageUrl} alt={product.name} className="look-img" />
          {turn !== null && (
            <img
              src={turn.url}
              alt=""
              aria-hidden="true"
              className="look-img look-img--turn"
            />
          )}
        </Link>

        {outOfStock && <span className="look-tissue">Sold out</span>}

        <Box className="look-actions">
          <IconButton
            size="small"
            className={`look-act${fav ? " look-act--on" : ""}`}
            onClick={() => toggle(product.id)}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          >
            {fav ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          <IconButton
            size="small"
            className={`look-act${added ? " look-act--done" : ""}`}
            disabled={outOfStock}
            onClick={() => !added && handleAdd()}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? <CheckIcon fontSize="small" /> : <AddShoppingCartIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>

      {/* The credits: the same facts in the same order under every photograph */}
      <Box className="look-credit">
        <Box className="look-title">
          {plate !== undefined && (
            <span className="look-no">{String(plate).padStart(2, "0")}</span>
          )}
          <Link to={`/products/${product.id}`} className="look-name">
            {product.name}
          </Link>
        </Box>
        <Box className="look-credit-line">
          {product.companySlug ? (
            <Link to={`/sellers/${product.companySlug}`} className="look-house">
              {product.companyName}
            </Link>
          ) : (
            <span className="look-house">{product.companyName}</span>
          )}
          <Typography component="span" className="look-price">
            {product.price.toFixed(2)}
            <span className="look-currency">RON</span>
          </Typography>
        </Box>
        {lowStock && <span className="look-last">Last {product.stockQuantity}</span>}
      </Box>

      <Snackbar
        open={error !== ""}
        autoHideDuration={4000}
        onClose={() => setError("")}
        message={error}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

export default ProductLook;
