import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ordersApi } from "../../api/clients/OrderApiClient";
import { PaymentMethod } from "../../api/models/OrderModel";
import { useAuth } from "../../context/AuthContext/auth-context";
import { useCart } from "../../context/CartContext/cart-context";
import { COUNTIES } from "../shared/constants/counties";
import LoadingState from "../common/LoadingState";
import "./Checkout.css";

// "4242424242424242" -> "4242 4242 4242 4242"
function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

// "1230" -> "12/30"
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function Checkout() {
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Card);
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  if (cart === null) return <LoadingState />;

  if (cart.items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" className="checkout-title">
          Your cart is empty
        </Typography>
        <Typography sx={{ color: "var(--text-secondary)", my: 2 }}>
          Add a few products before going to checkout.
        </Typography>
        <Button component={Link} to="/shop" variant="contained" color="primary">
          Back to the shop
        </Button>
      </Container>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    let card;
    if (paymentMethod === PaymentMethod.Card) {
      const [month, year] = expiry.split("/").map(Number);
      if (!month || !year || month > 12) {
        setError("Please enter the card expiry date as MM/YY.");
        return;
      }
      card = {
        holderName: cardHolder,
        number: cardNumber.replace(/\s/g, ""),
        expiryMonth: month,
        expiryYear: 2000 + year,
        cvv,
      };
    }

    setPlacing(true);
    try {
      const order = await ordersApi.place({
        shippingFullName: fullName,
        shippingPhone: phone.replace(/\s/g, ""),
        shippingAddress: address,
        shippingCity: city,
        shippingCounty: county,
        shippingPostalCode: postalCode,
        notes: notes || undefined,
        paymentMethod,
        card,
      });
      refreshCart();
      navigate(`/orders/${order.id}`, { replace: true, state: { placed: true } });
    } catch (err) {
      setError((err as Error).message);
      setPlacing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Box className="checkout-page">
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" className="checkout-title">
          Checkout
        </Typography>

        {error !== "" && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} className="checkout-layout">
          <Box className="checkout-main">
            <Box className="checkout-section">
              <Typography className="checkout-section-title">1. Delivery address</Typography>
              <Stack spacing={2}>
                <Box className="checkout-row">
                  <TextField
                    label="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    required
                    fullWidth
                  />
                  <TextField
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="0722 123 456"
                    helperText="The courier will call you on this number."
                    required
                    fullWidth
                  />
                </Box>
                <TextField
                  label="Street, number, building, apartment"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="street-address"
                  required
                  fullWidth
                />
                <Box className="checkout-row checkout-row--three">
                  <FormControl fullWidth required>
                    <InputLabel id="checkout-county-label">County</InputLabel>
                    <Select
                      labelId="checkout-county-label"
                      value={county}
                      label="County"
                      onChange={(e) => setCounty(e.target.value)}
                    >
                      {COUNTIES.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    autoComplete="address-level2"
                    required
                    fullWidth
                  />
                  <TextField
                    label="Postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    autoComplete="postal-code"
                    required
                    fullWidth
                  />
                </Box>
                <TextField
                  label="Notes for the courier (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                />
              </Stack>
            </Box>

            <Box className="checkout-section">
              <Typography className="checkout-section-title">2. Payment</Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(Number(e.target.value) as PaymentMethod)}
                className="checkout-payment-options"
              >
                <FormControlLabel
                  value={PaymentMethod.Card}
                  control={<Radio />}
                  label={
                    <Box className="checkout-payment-label">
                      <CreditCardIcon /> Card, paid now
                    </Box>
                  }
                />
                <FormControlLabel
                  value={PaymentMethod.CashOnDelivery}
                  control={<Radio />}
                  label={
                    <Box className="checkout-payment-label">
                      <PaymentsOutlinedIcon /> Cash on delivery
                    </Box>
                  }
                />
              </RadioGroup>

              {paymentMethod === PaymentMethod.Card && (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <TextField
                    label="Name on card"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    autoComplete="cc-name"
                    required
                    fullWidth
                  />
                  <TextField
                    label="Card number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    autoComplete="cc-number"
                    inputMode="numeric"
                    required
                    fullWidth
                  />
                  <Box className="checkout-row">
                    <TextField
                      label="Expiry (MM/YY)"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      autoComplete="cc-exp"
                      inputMode="numeric"
                      required
                      fullWidth
                    />
                    <TextField
                      label="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      required
                      fullWidth
                    />
                  </Box>
                  <Typography className="checkout-secure">
                    <LockOutlinedIcon sx={{ fontSize: 16 }} />
                    Payments are simulated. We only keep the last 4 digits of the card.
                  </Typography>
                  {import.meta.env.DEV && (
                    <Typography className="checkout-test-cards">
                      Test cards: 4242 4242 4242 4242 (accepted) · 4000 0000 0000 0002 (declined),
                      any future date, any 3 digits.
                    </Typography>
                  )}
                </Stack>
              )}
              {paymentMethod === PaymentMethod.CashOnDelivery && (
                <Typography className="checkout-secure" sx={{ mt: 1 }}>
                  You pay the courier when the package arrives.
                </Typography>
              )}
            </Box>
          </Box>

          <Box className="checkout-summary">
            <Typography className="checkout-section-title">Order summary</Typography>
            {cart.items.map((item) => (
              <Box key={item.id} className="checkout-summary-item">
                <Typography className="checkout-summary-name">
                  {item.quantity} × {item.productName}
                </Typography>
                <Typography className="checkout-summary-value">{item.subtotalLabel}</Typography>
              </Box>
            ))}
            <Box className="checkout-summary-divider" />
            <Box className="checkout-summary-item">
              <Typography>Subtotal</Typography>
              <Typography>{cart.subtotalLabel}</Typography>
            </Box>
            {cart.appliedPromotions.map((p) => (
              <Box key={p.promotionId} className="checkout-summary-item checkout-summary-discount">
                <Typography>{p.promotionName}</Typography>
                <Typography>{p.discountLabel}</Typography>
              </Box>
            ))}
            <Box className="checkout-summary-item">
              <Typography>Delivery</Typography>
              <Typography>{cart.shippingLabel}</Typography>
            </Box>
            <Box className="checkout-summary-divider" />
            <Box className="checkout-summary-item checkout-summary-total">
              <Typography>Total</Typography>
              <Typography>{cart.totalWithShippingLabel}</Typography>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={placing}
              sx={{ mt: 2 }}
            >
              {placing ? "Placing order…" : "Place order"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Checkout;
