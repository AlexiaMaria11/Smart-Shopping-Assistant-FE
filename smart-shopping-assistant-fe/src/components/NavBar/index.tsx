import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./NavBar.css";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "Products", to: "/products" },
  { label: "Promotions", to: "/promotions" },
];

function NavBar() {
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
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
