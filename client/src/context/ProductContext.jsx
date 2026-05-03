import React, { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export default function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Ürünler alınamadı:", err);
      });
  }, []);

  const addProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <ProductContext.Provider
      value={{ products, searchTerm, setSearchTerm, addProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}
