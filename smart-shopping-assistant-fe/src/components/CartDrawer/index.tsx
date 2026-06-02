import {
  Box,
  Divider,
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
import { useCart } from "../../context/CartContext/cart-context";

function CartDrawer() {
  const { cart, open, closeCart, updateQuantity, removeProduct } = useCart();

  const isEmpty = cart === null || cart.items.length === 0;

  return (
    <Drawer anchor="right" open={open} onClose={closeCart}>
      <Box
        sx={{
          width: 800,
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={closeCart}>
            <CloseIcon />
          </IconButton>
        </Box>

        {isEmpty ? (
          <Typography color="text.secondary">Your cart is empty.</Typography>
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflowY: "auto" }}>
              {cart.items.map((item) => (
                <ListItem
                  key={item.id}
                  divider
                  disableGutters
                  sx={{ display: "block", py: 1.5 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>{item.productName}</Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeProduct(item.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.unitPriceLabel} each
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        sx={{ mx: 1, minWidth: 24, textAlign: "center" }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography>{item.subtotalLabel}</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Divider />

            <Box sx={{ pt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography>Subtotal</Typography>
                <Typography>{cart.subtotalLabel}</Typography>
              </Box>
              {cart.appliedPromotions.map((promotion) => (
                <Box
                  key={promotion.promotionId}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography color="success.main">
                    {promotion.promotionName}
                  </Typography>
                  <Typography color="success.main">
                    {promotion.discountLabel}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">{cart.totalLabel}</Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}

export default CartDrawer;
