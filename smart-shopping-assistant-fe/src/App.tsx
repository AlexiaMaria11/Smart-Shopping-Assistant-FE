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
import AuthProvider from "./context/AuthContext/AuthProvider";
import CartDrawer from "./components/CartDrawer";
import Companies from "./components/Companies";
import Sellers from "./components/Sellers";
import SellerPage from "./components/Sellers/SellerPage";
import SellerStore from "./components/SellerStore";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import SellerRegister from "./components/Auth/SellerRegister";
import RequireRole from "./components/common/RequireRole";
import { Role } from "./api/models/AuthModel";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import OrderDetails from "./components/Orders/OrderDetails";
import SellerOrders from "./components/SellerOrders";
import AdminOrders from "./components/AdminOrders";

const adminOnly = [Role.Admin];
const sellerOnly = [Role.Seller];

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <Box className="app">
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/sellers" element={<Sellers />} />
              <Route path="/sellers/:slug" element={<SellerPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/seller" element={<SellerRegister />} />
              <Route
                path="/favorites"
                element={<RequireRole><Favorites /></RequireRole>}
              />
              <Route
                path="/checkout"
                element={<RequireRole><Checkout /></RequireRole>}
              />
              <Route
                path="/orders"
                element={<RequireRole><Orders /></RequireRole>}
              />
              <Route
                path="/orders/:id"
                element={<RequireRole><OrderDetails /></RequireRole>}
              />

              <Route
                path="/admin/companies"
                element={<RequireRole roles={adminOnly}><Companies /></RequireRole>}
              />
              <Route
                path="/admin/orders"
                element={<RequireRole roles={adminOnly}><AdminOrders /></RequireRole>}
              />
              <Route
                path="/admin/categories"
                element={<RequireRole roles={adminOnly}><Categories /></RequireRole>}
              />
              <Route
                path="/admin/products"
                element={<RequireRole roles={adminOnly}><Products /></RequireRole>}
              />
              <Route
                path="/admin/promotions"
                element={<RequireRole roles={adminOnly}><Promotions /></RequireRole>}
              />

              <Route
                path="/seller/store"
                element={<RequireRole roles={sellerOnly}><SellerStore /></RequireRole>}
              />
              <Route
                path="/seller/orders"
                element={<RequireRole roles={sellerOnly}><SellerOrders /></RequireRole>}
              />
              <Route
                path="/seller/products"
                element={<RequireRole roles={sellerOnly}><Products /></RequireRole>}
              />
              <Route
                path="/seller/promotions"
                element={<RequireRole roles={sellerOnly}><Promotions /></RequireRole>}
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <CartDrawer />
          </Box>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
