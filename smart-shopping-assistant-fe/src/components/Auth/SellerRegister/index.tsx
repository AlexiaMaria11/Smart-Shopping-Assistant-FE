import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext/auth-context";
import "../Auth.css";

function SellerRegister() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { registerSeller } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8 || !/\d/.test(password)) {
      setError("The password must have at least 8 characters and one digit.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await registerSeller({
        fullName,
        email,
        password,
        company: {
          name: companyName,
          description: description || undefined,
          contactEmail: contactEmail || email,
          website: website || undefined,
        },
      });
      navigate("/seller/store", { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Box className="auth-page">
      <Box className="auth-card auth-card--wide">
        <Typography variant="h4" className="auth-title">
          Sell on Smart Shop
        </Typography>
        <Typography className="auth-subtitle">
          Register your company and start adding products right away. Your store
          becomes visible to customers after our team approves it, usually within
          one working day.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {error !== "" && <Alert severity="error">{error}</Alert>}

            <Typography className="auth-section-label">Your account</Typography>
            <TextField
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              helperText="At least 8 characters, including a digit."
              required
              fullWidth
            />

            <Typography className="auth-section-label">Your company</Typography>
            <TextField
              label="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="What do you sell?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Contact email for customers"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              helperText="Leave empty to use your account email."
              fullWidth
            />
            <TextField
              label="Website (optional)"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={saving}
            >
              Register company
            </Button>
          </Stack>
        </Box>

        <Typography className="auth-footer">
          Already selling with us? <Link to="/login">Sign in</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default SellerRegister;
