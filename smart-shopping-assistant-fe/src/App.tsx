import { Box } from "@mui/material";
import "./App.css";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Home from "./components/Home";

function App() {
  return (
    <>
      <Box className="app">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
