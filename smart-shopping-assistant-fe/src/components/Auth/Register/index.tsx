import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext/auth-context";
import { homeForRole } from "../homeForRole";
import "../Auth.css";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8 || !/\d/.test(password)) {
      setError("The password must have at least 8 characters and one digit.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const user = await register({ fullName, email, password });
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
          Create an account
        </Typography>
        <Typography className="auth-subtitle">
          Save your cart and favorites and see your orders from any device.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {error !== "" && <Alert severity="error">{error}</Alert>}
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={saving}
            >
              Create account
            </Button>
          </Stack>
        </Box>

        <Typography className="auth-footer">
          Already have an account? <Link to="/login" state={location.state}>Sign in</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Register;
