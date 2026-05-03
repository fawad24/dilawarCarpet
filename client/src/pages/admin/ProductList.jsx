import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
  const ok = window.confirm(
    "Bu ürünü silmek istediğinize emin misiniz?\nBu işlem geri alınamaz!"
  );

  if (!ok) return;

  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
      
    });

     if (!res.ok) throw new Error("Silinemedi");

    // 🔥 Sildikten sonra listeden düşür
    setProducts((prev) => prev.filter((p) => p._id !== id));
  } catch (err) {
    alert("Ürün silinemedi");
  }
};


  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-center bg-slate-50 rounded-3xl shadow py-1 px-4">Ürünler</h1>
        <Link
          to="/admin/products/new"
          className="bg-lime-400 text-white px-4 py-2 rounded-3xl shadow"
        >
          + Yeni Ürün
        </Link>
      </div>

      <table className="w-full rounded-3xl">
        <thead className="bg-slate-100 ">
          <tr>
            <th className=" p-2 bg-slate-200 shadow rounded-3xl">Resim</th>
            <th className=" p-2 bg-slate-200 rounded-3xl shadow">Ad</th>
            <th className=" p-2 bg-slate-200 rounded-3xl shadow">Fiyat</th>
            <th className=" p-2 bg-slate-200 rounded-3xl shadow">İşlem</th>
          </tr>
        </thead>
<tbody>
  {products.map(product => (
    <tr key={product._id}>
      {/* 1. Resim */}
      <td className=" p-2 rounded-3xl shadow">
        <img
          src={
            product.images && product.images.length > 0
              ? `${API_URL}${product.images[0]}`
              : "/no-image.png"
          }
          className="w-20 h-20 object-contain"
        />
      </td>

      {/* 2. Ürün adı */}
      <td className=" p-2 rounded-3xl shadow">{product.name}</td>

      {/* 3. Fiyat */}
      <td className=" p-2 rounded-3xl shadow">{product.price} ₺</td>

      {/* 4. İşlem */}
      <td className=" p-2 space-x-3 rounded-3xl shadow">
        <Link
          to={`/admin/products/edit/${product._id}`}
          className="text-blue-600 bg-slate-200 rounded-3xl shadow px-3 py-1 hover:bg-slate-300"
        >
          Düzenle
        </Link>

        <button
          onClick={() => handleDelete(product._id)}
          className="text-red-600 bg-slate-200 rounded-3xl shadow py-1 px-3 hover:bg-slate-300 "
        >
          Sil
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
