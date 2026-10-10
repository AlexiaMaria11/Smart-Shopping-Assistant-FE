import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useCart } from "../../context/CartContext/cart-context";
import "./CartDrawer.css";
import { useEffect, useState } from "react";
import { featuresApi } from "../../api/clients/FeaturesApiClient";
import { useNavigate } from "react-router-dom";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AnalyzeDialog from "./AnalyzeDialog";

function CartDrawer() {
  const { cart, open, closeCart, updateQuantity, removeProduct } = useCart();
  const isEmpty = cart === null || cart.items.length === 0;
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  // The AI button only shows when the server has an AI key configured
  const [aiAvailable, setAiAvailable] = useState(false);

  useEffect(() => {
    featuresApi.get().then((features) => setAiAvailable(features.aiAssistant));
  }, []);
  const navigate = useNavigate();
  const hasStockProblem =
    cart !== null && cart.items.some((i) => i.quantity > i.availableStock);

  return (
    <Drawer anchor="right" open={open} onClose={closeCart}>
      <Box className="cart-drawer">
        <Box className="cart-header">
          <Box className="cart-header-info">
            <Typography className="cart-header-title">Cart</Typography>
            {!isEmpty && (
              <Box className="cart-item-badge">{cart!.itemCount}</Box>
            )}
          </Box>
          <IconButton
            onClick={closeCart}
            size="small"
            className="cart-close-btn"
            aria-label="Close cart"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {isEmpty ? (
          <Box className="cart-empty">
            <Box className="cart-empty-icon">
              <ShoppingCartOutlinedIcon className="cart-empty-icon-svg" />
            </Box>
            <Typography className="cart-empty-title">
              Your cart is empty
            </Typography>
            <Typography className="cart-empty-desc">
              Browse our collection and add something you love.
            </Typography>
          </Box>
        ) : (
          <>
            <List className="cart-list">
              {cart!.items.map((item, idx) => (
                <ListItem
                  key={item.id}
                  disableGutters
                  className={`cart-item${idx < cart!.items.length - 1 ? " cart-item--bordered" : ""}`}
                >
                  <Box className="cart-item-row cart-item-row--top">
                    <Typography className="cart-item-name">
                      {item.productName}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeProduct(item.id)}
                      className="cart-remove-btn"
                      aria-label={`Remove ${item.productName} from cart`}
                    >
                      <DeleteIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Box>

                  <Typography className="cart-item-unit-price">
                    {item.unitPriceLabel} / piece
                  </Typography>
                  {item.quantity > item.availableStock && (
                    <Typography className="cart-item-stock-warning">
                      {item.availableStock === 0
                        ? "Sold out since you added it. Please remove it."
                        : `Only ${item.availableStock} left. Please lower the quantity.`}
                    </Typography>
                  )}

                  <Box className="cart-item-row">
                    <Box className="cart-qty-control">
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="cart-qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <RemoveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Typography className="cart-qty-value">
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.availableStock}
                        className="cart-qty-btn"
                        aria-label="Increase quantity"
                      >
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                    <Typography className="cart-item-subtotal">
                      {item.subtotalLabel}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Box className="cart-totals">
              <Box className="cart-totals-row">
                <Typography className="cart-subtotal-label">
                  Subtotal
                </Typography>
                <Typography className="cart-subtotal-value">
                  {cart!.subtotalLabel}
                </Typography>
              </Box>

              {cart!.appliedPromotions.map((promotion) => (
                <Box key={promotion.promotionId} className="cart-promo-row">
                  <Box className="cart-promo-info">
                    <LocalOfferOutlinedIcon className="cart-promo-icon" />
                    <Typography className="cart-promo-label">
                      {promotion.promotionName}
                    </Typography>
                  </Box>
                  <Typography className="cart-promo-value">
                    {promotion.discountLabel}
                  </Typography>
                </Box>
              ))}

              <Box className="cart-totals-row">
                <Typography className="cart-subtotal-label">Delivery</Typography>
                <Typography className="cart-subtotal-value">
                  {cart!.shippingLabel}
                </Typography>
              </Box>

              {cart!.freeShippingRemaining > 0 && (
                <Box className="cart-free-shipping">
                  <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />
                  Add {cart!.freeShippingRemainingLabel} more for free delivery
                </Box>
              )}

              <Box className="cart-accent-rule" />

              <Box className="cart-total-row">
                <Typography className="cart-total-label">Total</Typography>
                <Typography className="cart-total-amount">
                  {cart!.totalWithShippingLabel}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={hasStockProblem}
                onClick={() => {
                  closeCart();
                  navigate("/checkout");
                }}
                className="cart-checkout-btn"
              >
                {hasStockProblem ? "Fix the quantities above" : "Checkout"}
              </Button>

              {aiAvailable && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AutoAwesomeIcon />}
                  onClick={() => setAnalyzeOpen(true)}
                  className="cart-analyze-btn"
                >
                  AI Analyze
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
      {analyzeOpen && <AnalyzeDialog onClose={() => setAnalyzeOpen(false)} />}
    </Drawer>
  );
}

export default CartDrawer;
