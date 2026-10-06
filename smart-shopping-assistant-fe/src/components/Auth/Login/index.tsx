import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext/auth-context";
import { homeForRole } from "../homeForRole";
import "../Auth.css";

const demoAccounts = [
  { label: "Customer", email: "client@smartshop.ro", password: "Client1234" },
  { label: "Seller (TechNova)", email: "contact@technova.ro", password: "Seller1234" },
  { label: "Admin", email: "admin@smartshop.ro", password: "Admin1234" },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const user = await login({ email, password });
      navigate(from ?? homeForRole(user.role), { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Box className="auth-page">
      <Box className="auth-card">
        <Typography variant="h4" className="auth-title">
          Sign in
        </Typography>
        <Typography className="auth-subtitle">
          {from
            ? "You need an account to keep a cart and a list of favorites."
            : "Welcome back to Smart Shop."}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {error !== "" && <Alert severity="error">{error}</Alert>}
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
              autoComplete="current-password"
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={saving}
            >
              Sign in
            </Button>
          </Stack>
        </Box>

        <Typography className="auth-footer">
          No account yet? <Link to="/register" state={location.state}>Create one</Link>
          <br />
          Want to sell on Smart Shop? <Link to="/register/seller">Register your company</Link>
        </Typography>

        {import.meta.env.DEV && (
          <Box className="auth-demo">
            Demo accounts (development only):
            {demoAccounts.map((account) => (
              <div key={account.email}>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                  }}
                >
                  {account.label}
                </button>{" "}
                {account.email} / {account.password}
              </div>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Login;
