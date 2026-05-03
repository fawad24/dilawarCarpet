import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TranslationProvider } from "./context/TranslationContext";

import MainLayout from "./layout/MainLayout.jsx";
import Bilgilerim from "./pages/Bilgilerim";
// Pages
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Checkout from "./pages/checkout";
import MyOrders from "./pages/MyOrders";




// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProductList from "./pages/admin/ProductList.jsx";
import AddProduct from "./pages/admin/AddProduct.jsx";
import EditProduct from "./pages/admin/EditProduct.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";


// Contexts
import ProductProvider from "./context/ProductContext.jsx";
import CartProvider from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Components
import AdminRoute from "./components/AdminRoute.jsx";

function App() {
  return (
    <TranslationProvider>
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Toaster position="bottom-right" />

            <Routes>
              {/* Navbar tüm sayfalarda görünür */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/bilgilerim" element={<Bilgilerim />} />
                <Route path="/orders" element={<MyOrders />} />



                {/* Auth sayfaları */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* Admin sayfaları */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/new" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
               <Route path="orders" element={<AdminOrders />} />

                 
  
              </Route>
            </Routes>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
    </TranslationProvider>
  );
}

export default App;
