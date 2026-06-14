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
import { useCart } from "../../context/CartContext/cart-context";
import "./CartDrawer.css";
import { useState } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AnalyzeDialog from "./AnalyzeDialog";

function CartDrawer() {
  const { cart, open, closeCart, updateQuantity, removeProduct } = useCart();
  const isEmpty = cart === null || cart.items.length === 0;

  const [analyzeOpen, setAnalyzeOpen] = useState(false);

  return (
    <Drawer anchor="right" open={open} onClose={closeCart}>
      <Box
        sx={{
          width: { xs: 340, sm: 420 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
            sx={{
              color: "rgba(255,255,255,0.7)",
              "&:hover": {
                color: "var(--accent)",
                background: "rgba(196,144,124,0.12)",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {isEmpty ? (
          <Box className="cart-empty">
            <Typography className="cart-empty-title">
              Your cart is empty
            </Typography>
            <Typography className="cart-empty-desc">
              Browse our collection and add something you love.
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ flex: 1, overflowY: "auto", px: 2, py: 1.5 }}>
              {cart!.items.map((item, idx) => (
                <ListItem
                  key={item.id}
                  disableGutters
                  sx={{
                    display: "block",
                    py: 2,
                    borderBottom:
                      idx < cart!.items.length - 1
                        ? "1px solid #EAD9CC"
                        : "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 0.5,
                    }}
                  >
                    <Typography className="cart-item-name">
                      {item.productName}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeProduct(item.id)}
                      sx={{
                        color: "#9A6855",
                        p: 0.5,
                        "&:hover": {
                          color: "var(--primary)",
                          background: "rgba(114,47,55,0.07)",
                        },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Box>

                  <Typography className="cart-item-unit-price">
                    {item.unitPriceLabel} / piece
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box className="cart-qty-control">
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        sx={{
                          color: "var(--primary)",
                          p: "4px 8px",
                          borderRadius: 0,
                          "&:disabled": { color: "#C4B08A" },
                          "&:hover": { background: "rgba(114,47,55,0.10)" },
                        }}
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
                        sx={{
                          color: "var(--primary)",
                          p: "4px 8px",
                          borderRadius: 0,
                          "&:hover": { background: "rgba(114,47,55,0.10)" },
                        }}
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
                    <LocalOfferOutlinedIcon
                      sx={{ fontSize: 14, color: "#5C8A4E" }}
                    />
                    <Typography className="cart-promo-label">
                      {promotion.promotionName}
                    </Typography>
                  </Box>
                  <Typography className="cart-promo-value">
                    {promotion.discountLabel}
                  </Typography>
                </Box>
              ))}

              <Box className="cart-accent-rule" />

              <Box className="cart-total-row">
                <Typography className="cart-total-label">Total</Typography>
                <Typography className="cart-total-amount">
                  {cart!.totalLabel}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<AutoAwesomeIcon />}
                onClick={() => setAnalyzeOpen(true)}
                sx={{ mt: 2 }}
              >
                AI Analyze
              </Button>
            </Box>
          </>
        )}
      </Box>
      {analyzeOpen && <AnalyzeDialog onClose={() => setAnalyzeOpen(false)} />}
    </Drawer>
  );
}

export default CartDrawer;
