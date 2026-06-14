import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./NavBar.css";
import { useState } from "react";
import { useCart } from "../../context/CartContext/cart-context";
import { useFavorites } from "../../context/FavoritesContext/favorites-context";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";

const adminLinks = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "Products", to: "/products" },
  { label: "Promotions", to: "/promotions" },
];

const userLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Favorites", to: "/favorites" },
];

function NavBar() {
  const [mode, setMode] = useState<"user" | "admin">("user");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { cart, openCart } = useCart();
  const { favorites } = useFavorites();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const links = mode === "admin" ? adminLinks : userLinks;

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: "user" | "admin",
  ) => {
    setMode(value);
    navigate("/");
    setMobileOpen(false);
  };

  const mobileDrawer = (
    <Box className="navbar-mobile-drawer">
      <List>
        {links.map(({ label, to }) => (
          <ListItemButton
            key={to}
            component={NavLink}
            to={to}
            end={to === "/"}
            onClick={() => setMobileOpen(false)}
            className="navbar-mobile-link"
          >
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" className="navbar" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar className="navbar-toolbar">
            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                className="navbar-hamburger"
                aria-label="Open navigation menu"
              >
                <MenuIcon />
              </IconButton>
            )}

            <Link to="/">
              <Box
                component="img"
                src={logo}
                alt="Smart Shopping Assistant Logo"
                className="navbar-logo"
              />
            </Link>

            {!isMobile && (
              <Box className="navbar-links">
                {links.map(({ label, to }) => (
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
            )}

            <ToggleButtonGroup
              value={mode}
              exclusive
              size="small"
              sx={{ mr: 1.5 }}
              onChange={handleModeChange}
            >
              <ToggleButton
                value="user"
                className="navbar-toggle-btn"
              >
                User
              </ToggleButton>
              <ToggleButton
                value="admin"
                className="navbar-toggle-btn"
              >
                Admin
              </ToggleButton>
            </ToggleButtonGroup>

            {mode === "user" && (
              <Box className="navbar-user-actions">
                <IconButton
                  component={Link}
                  to="/favorites"
                  className="cart-icon-btn"
                  aria-label={`Favorites (${favorites.size})`}
                >
                  <Badge
                    badgeContent={favorites.size}
                    color="warning"
                  >
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>

                <IconButton
                  className="cart-icon-btn"
                  onClick={openCart}
                  aria-label={`Cart (${cart?.itemCount ?? 0} items)`}
                >
                  <Badge
                    badgeContent={cart?.itemCount ?? 0}
                    color="warning"
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ "& .MuiDrawer-paper": { borderRadius: "0 20px 20px 0" } }}
      >
        {mobileDrawer}
      </Drawer>
    </>
  );
}

export default NavBar;
