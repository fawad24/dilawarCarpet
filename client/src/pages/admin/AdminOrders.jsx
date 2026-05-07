import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Admin login ile siparişleri çek
    if (!API_URL) return;
    fetch(`${API_URL}/api/orders`, {
      credentials: "include", // login şart
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Siparişler alınamadı:", err);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 bg-slate-200 rounded-3xl shadow text-center py-1">📦 Siparişler</h1>

      {orders.length === 0 && <p>Henüz sipariş yok.</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-3xl p-4 mb-4 bg-slate-200 shadow"
        >
           <span className="text-sm text-black  bg-slate-50 rounded-3xl shadow py-1 px-5 ml-96 ">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          <div className="mb-2 mt-3 font-semibold bg-slate-100 rounded-3xl shadow px-2 py-1">
            👤 Müşteri: {order.user.email || "-"}
          </div>

          <div className="mb-2 bg-slate-100 shadow rounded-3xl px-2 py-1">
            📍 İsim: {order.user.firstName || "-"}
          </div>

          <div className="mb-2 bg-slate-100 shadow rounded-3xl px-2 py-1">
            📍 Adres: {order.user.address || "-"}
          </div>

          <div className="mb-2 bg-slate-100 shadow rounded-3xl px-2 py-1">
            📞 Telefon: {order.user.phone || "-"}
          </div>

          {/* KARGO DURUMU */}
          <div className="mt-3 bg-slate-100 shadow rounded-3xl px-2 py-2">
            <label className="text-sm font-semibold mr-2">📦 Kargo Durumu:</label>

            <select
              value={order.deliveryStatus}
              onChange={async (e) => {
                const newStatus = e.target.value;

                try {
                  const res = await fetch(
                    `${API_URL}/api/orders/${order._id}/delivery`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                      body: JSON.stringify({ deliveryStatus: newStatus }),
                    }
                  );

                  if (!res.ok) throw new Error("Güncellenemedi");

                  const updatedOrder = await res.json();

                  setOrders((prev) =>
                    prev.map((o) =>
                      o._id === updatedOrder._id ? updatedOrder : o
                    )
                  );
                } catch (err) {
                  console.error(err);
                  alert("Kargo durumu güncellenemedi");
                }
              }}
              className=" bg-slate-300 shadow rounded-3xl px-2 py-1"
            >
              <option value="hazirlaniyor">Hazırlanıyor</option>
              <option value="kargoda">Kargoda</option>
              <option value="teslim_edildi">Teslim Edildi</option>
            </select>
          </div>

          <div className="mb-2 mt-3 bg-slate-100 shadow rounded-3xl px-2 py-1">
            💳 Ödeme: {order.paymentMethod}{" "}
            {order.paid ? "(Ödendi ✅)" : "(Beklemede ⏳)"}
          </div>

          <div className="mb-2 font-bold bg-slate-100 shadow rounded-3xl px-2 py-1">
            Toplam: {order.total} ₺
          </div>

          {/* ÜRÜNLER */}
          <div className="mt-3 mb-4 bg-slate-100 shadow rounded-3xl px-2 py-1">
            <p className="font-semibold bg-slate-200 shadow rounded-3xl px-2 py-1 mb-3 max-w-20 mt-2">Ürünler:</p>
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center text-sm ml-2 mb-2 gap-2"
              >
                {/* Ürün resmi */}
                {item.images && item.images.length > 0 && (
                 <img
  src={
    item.images?.length > 0
      ? item.images[0].startsWith("http")
        ? item.images[0]
        : `${BASE_URL}/uploads/${item.images[0]
            .split("/uploads/")
            .pop()}`
      : "/no-image.png"
  }
  alt={item.name}
  className="w-12 h-12 object-contain rounded border"
/>
                )}
                {/* Ürün adı ve miktar */}
                <span>
                  • {item.name} × {item.quantity} — {item.price} ₺
                </span>
              </div>
            ))}
          </div>

          

          {/* Ödeme Alındı Butonu */}
          {!order.paid && (
            <button
              onClick={async () => {
                try {
                  const res = await fetch(
                    `${API_URL}/api/orders/${order._id}/pay`,
                    {
                      method: "POST",
                      credentials: "include",
                    }
                  );
                  if (!res.ok) throw new Error("Güncelleme başarısız");

                  setOrders((prev) =>
                    prev.map((o) =>
                      o._id === order._id ? { ...o, paid: true } : o
                    )
                  );
                } catch (err) {
                  console.error(err);
                  alert("Ödeme güncellenemedi");
                }
              }}
              className="mt-3 bg-lime-400 text-white px-4 py-2 rounded-3xl shadow hover:bg-lime-500"
            >
              Ödeme Alındı
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
