import { Box } from "@mui/material";
import "./App.css";
import NavBar from "./components/NavBar";
import { Navigate, Route, Routes } from "react-router-dom";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Home from "./components/Home";
import Promotions from "./components/Promotions";
import Shop from "./components/Shop";
import Favorites from "./components/Favorites";
import CartProvider from "./context/CartContext/CartProvider";
import FavoritesProvider from "./context/FavoritesContext/FavoritesProvider";
import CartDrawer from "./components/CartDrawer";

function App() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <Box className="app">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <CartDrawer />
        </Box>
      </CartProvider>
    </FavoritesProvider>
  );
}

export default App;
