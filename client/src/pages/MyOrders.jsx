import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "../context/TranslationContext";
import { UI_TEXT } from "../config/uiText";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/my`, {
          withCredentials: true,
        });
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Siparişler alınamadı", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">{t(UI_TEXT.loading)}</p>;
  if (orders.length === 0) return <p className="p-6">{t(UI_TEXT.noOrders)}</p>;

  return (
    <div className="lg:p-20 p-3 space-y-7 bg-slate-200">
      <h1 className="text-2xl py-2 mt-24 font-bold mb-4 text-center rounded-3xl bg-slate-50 shadow">{t(UI_TEXT.myOrders)}</h1>

      {orders.map(order => (
        <div key={order._id} className="bg-slate-100 h-60 rounded-3xl shadow p-2 border hover:bg-slate-200">
          {/* Üst bilgi */}
          <div className="flex justify-between items-center mb-2 ">
            <span className="font-semibold bg-slate-50 rounded-3xl shadow py-1 px-2">
              Payment No: {order._id.slice(-6)}
            </span>
            <span className="text-sm text-black  bg-slate-50 rounded-3xl shadow py-1 px-2">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Ürünler */}
          <div className="mb-2 space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 text-sm text-gray-700">
                {/* Ürün resmi */}
                <img
                  src={
  item.images?.length > 0
    ? `${BASE_URL}${item.images[0]}`
    : "/no-image.png"
}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded border"
                />
                {/* Ürün adı ve miktar */}
                <span className="bg-slate-50 font-bold rounded-3xl shadow py-1 px-2 text-teal-950">
                  • {item.name} ({item.quantity} quantity)
                </span>
              </div>
            ))}
          </div>

          {/* Toplam */}
          <div className="font-semibold mb-2">{t(UI_TEXT.total)}: {order.total} ₺</div>

          {/* Durumlar */}
          <div className="flex gap-4 text-sm ">
            <span className="bg-slate-50 shadow rounded-3xl px-2 py-1">
              💳 {t(UI_TEXT.payment)}:{" "}
              {order.paid ? (
                <span className="text-green-600 font-semibold">Onaylandi</span>
              ) : (
                <span className="text-yellow-600 font-semibold">{t(UI_TEXT.pending)}</span>
              )}
            </span>

            <span className="bg-slate-50 rounded-3xl shadow px-2 py-1">
              📦 Status:{" "}
              <span className="font-semibold">
                {order.deliveryStatus === "hazirlaniyor" && t(UI_TEXT.preparing)}
                {order.deliveryStatus === "kargoda" && t(UI_TEXT.shipped)}
                {order.deliveryStatus === "teslim_edildi" && t(UI_TEXT.delivered)}
              </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
