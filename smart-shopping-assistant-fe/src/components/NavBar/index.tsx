import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
} from "@mui/material";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./NavBar.css";
import { useState } from "react";
import { useCart } from "../../context/CartContext/cart-context";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "Products", to: "/products" },
  { label: "Promotions", to: "/promotions" },
];

function NavBar() {
  const [mode, setMode] = useState<"user" | "admin">("user");
  const navigate = useNavigate();
  const { cart, openCart } = useCart();

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: "user" | "admin",
  ) => {
    setMode(value);
    navigate("/");
  };

  return (
    <AppBar position="sticky" className="navbar">
      <Container maxWidth="xl">
        <Toolbar className="navbar-toolbar">
          <Link to="/">
            <Box
              component="img"
              src={logo}
              alt="Smart Shopping Assistant Logo"
              className="navbar-logo"
            />
          </Link>

          {mode === "admin" ? (
            <Box className="navbar-links">
              {navLinks.map(({ label, to }) => (
                <Button
                  key={to}
                  component={NavLink}
                  to={to}
                  end={to === "/"}
                  className="nav-btn"
                >
                  {label}
                </Button>
              ))}
            </Box>
          ) : (
            <Box className="navbar-links">
              <Button component={NavLink} to="/" className="nav-btn">
                Home
              </Button>
              <Button component={NavLink} to="/shop" className="nav-btn">
                Shop
              </Button>
            </Box>
          )}
          <ToggleButtonGroup
            value={mode}
            exclusive
            size="small"
            sx={{ mr: 2 }}
            onChange={handleModeChange}
          >
            <ToggleButton
              value="user"
              sx={{ color: "white", "&.Mui-selected": { color: "white" } }}
            >
              User
            </ToggleButton>
            <ToggleButton
              value="admin"
              sx={{ color: "white", "&.Mui-selected": { color: "white" } }}
            >
              Admin
            </ToggleButton>
          </ToggleButtonGroup>
          {mode === "user" && (
            <IconButton color="inherit" onClick={openCart}>
              <Badge badgeContent={cart?.itemCount ?? 0} color="warning">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
