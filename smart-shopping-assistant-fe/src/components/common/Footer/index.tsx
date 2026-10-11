import { Box, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext/auth-context";
import "./Footer.css";

// Every route used to dead-end at the bottom of its content. The footer gives the
// app an ending and a way back into the catalogue from anywhere.
function Footer() {
  const { user } = useAuth();

  return (
    <Box component="footer" className="site-footer">
      <Container maxWidth="lg">
        <Box className="site-footer-row">
          <Box>
            <Typography className="site-footer-brand">Smart Shop</Typography>
            <Typography className="site-footer-note">
              A marketplace where independent shops share one catalogue and one
              checkout.
            </Typography>
          </Box>

          <Box component="nav" className="site-footer-links" aria-label="Footer">
            <Link to="/shop">Shop</Link>
            <Link to="/sellers">Sellers</Link>
            {user === null ? (
              <>
                <Link to="/login">Sign in</Link>
                <Link to="/register/seller">Open a store</Link>
              </>
            ) : (
              <Link to="/orders">Orders</Link>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
