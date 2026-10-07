import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./NavBar.css";
import { useState } from "react";
import { useCart } from "../../context/CartContext/cart-context";
import { useFavorites } from "../../context/FavoritesContext/favorites-context";
import { useAuth } from "../../context/AuthContext/auth-context";
import { Role } from "../../api/models/AuthModel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

interface NavLinkItem {
  label: string;
  to: string;
}

const customerLinks: NavLinkItem[] = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Sellers", to: "/sellers" },
];

const sellerLinks: NavLinkItem[] = [
  { label: "My store", to: "/seller/store" },
  { label: "Orders", to: "/seller/orders" },
  { label: "Products", to: "/seller/products" },
  { label: "Promotions", to: "/seller/promotions" },
  { label: "Shop", to: "/shop" },
];

const adminLinks: NavLinkItem[] = [
  { label: "Orders", to: "/admin/orders" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Categories", to: "/admin/categories" },
  { label: "Products", to: "/admin/products" },
  { label: "Promotions", to: "/admin/promotions" },
  { label: "Shop", to: "/shop" },
];

function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const { cart, openCart } = useCart();
  const { favorites } = useFavorites();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const links =
    user?.role === Role.Admin
      ? adminLinks
      : user?.role === Role.Seller
        ? sellerLinks
        : customerLinks;
  const showShoppingActions = user === null || user.role === Role.Customer;

  function handleLogout() {
    setAccountAnchor(null);
    logout();
    navigate("/");
  }

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

            {!isMobile ? (
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
            ) : (
              <Box sx={{ flexGrow: 1 }} />
            )}

            <Box className="navbar-user-actions">
              {showShoppingActions && (
                <>
                  <IconButton
                    component={Link}
                    to="/favorites"
                    className="cart-icon-btn"
                    aria-label={`Favorites (${favorites.size})`}
                  >
                    <Badge badgeContent={favorites.size} color="warning">
                      <FavoriteBorderIcon />
                    </Badge>
                  </IconButton>

                  <IconButton
                    className="cart-icon-btn"
                    onClick={openCart}
                    aria-label={`Cart (${cart?.itemCount ?? 0} items)`}
                  >
                    <Badge badgeContent={cart?.itemCount ?? 0} color="warning">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </>
              )}

              {user === null ? (
                <Button component={Link} to="/login" className="nav-btn navbar-signin-btn">
                  Sign in
                </Button>
              ) : (
                <IconButton
                  onClick={(e) => setAccountAnchor(e.currentTarget)}
                  aria-label="Account menu"
                  className="navbar-account-btn"
                >
                  <Avatar className="navbar-avatar">
                    {user.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Menu
        anchorEl={accountAnchor}
        open={accountAnchor !== null}
        onClose={() => setAccountAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {user !== null && (
          <Box className="navbar-account-header">
            <Typography className="navbar-account-name">{user.fullName}</Typography>
            <Typography className="navbar-account-email">{user.email}</Typography>
            <Typography className="navbar-account-role">
              {user.role === Role.Seller && user.companyName
                ? `Seller · ${user.companyName}`
                : user.role}
            </Typography>
          </Box>
        )}
        <Divider />
        {user?.role === Role.Customer && (
          <MenuItem
            onClick={() => {
              setAccountAnchor(null);
              navigate("/orders");
            }}
          >
            <ListItemIcon>
              <ReceiptLongOutlinedIcon fontSize="small" />
            </ListItemIcon>
            My orders
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>

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
