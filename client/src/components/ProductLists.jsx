import React, { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";


export default function ProductList() {
  const { products, searchTerm, setProducts } = useContext(ProductContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bu ürünü silmek istediğinize emin misiniz?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        credentials: "include", // 🔥 auth ile uyumlu
      });

      if (!res.ok) throw new Error("Silme başarısız");

      // UI'dan kaldır (optimistic update)
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Silme işlemi başarısız");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-0 px-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onDelete={handleDelete} // 🔥 önemli
          />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          Aradığınız ürün bulunamadı.
        </p>
      )}
    </div>
  );
}