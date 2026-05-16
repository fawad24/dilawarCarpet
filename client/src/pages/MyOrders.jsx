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
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/my`,
          {
            withCredentials: true,
          }
        );

        setOrders(
          Array.isArray(res.data) ? res.data : []
        );
      } catch (err) {
        console.error(
          "Siparişler alınamadı",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <p className="p-6">
        {t(UI_TEXT.loading)}
      </p>
    );

  if (orders.length === 0)
    return (
      <p className="p-6">
        {t(UI_TEXT.noOrders)}
      </p>
    );

  return (
    <div className="lg:p-20 p-8 space-y-7 bg-slate-200 min-h-screen">
      
      <h1 className="text-2xl py-2 mt-24 font-bold mb-4 text-center rounded-3xl bg-slate-50 shadow">
        {t(UI_TEXT.myOrders)}
      </h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-slate-100 rounded-3xl shadow p-4 border hover:bg-slate-200 transition"
        >
          
          {/* Üst Bilgi */}
          <div className="flex justify-between items-center mb-4">
            
            <span className="font-semibold bg-slate-50 rounded-3xl shadow py-1 px-3">
              Payment No: {order._id.slice(-6)}
            </span>

            <span className="text-sm text-black bg-slate-50 rounded-3xl shadow py-1 px-3">
              {new Date(
                order.createdAt
              ).toLocaleDateString()}
            </span>
          </div>

          {/* Ürünler */}
          <div className="mb-4 space-y-3">
            
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 bg-slate-50 rounded-3xl shadow p-3"
              >
                
                <div className="flex items-center gap-4">
                  
                  {/* Resim */}
                  <img
                    src={
                      item.images?.length > 0
                        ? item.images[0].startsWith(
                            "http"
                          )
                          ? item.images[0]
                          : `${BASE_URL}/uploads/${item.images[0]
                              .split("/uploads/")
                              .pop()}`
                        : "/no-image.png"
                    }
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-xl border"
                  />

                  {/* Bilgiler */}
                  <div>
                    <p className="font-bold text-teal-950">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-600">
                      {item.quantity} quantity
                    </p>

                    {/* 🔥 İndirim etiketi */}
                    <span className="inline-block mt-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Kurban Bayramı İndirimi
                    </span>
                  </div>
                </div>

                {/* Fiyatlar */}
                <div className="text-right">
                  
                  {/* Eski fiyat */}
                  {item.originalPrice && (
                    <p className="text-gray-400 line-through text-sm">
                      {(
                        item.originalPrice *
                        item.quantity
                      ).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}{" "}
                      ₺
                    </p>
                  )}

                  {/* Yeni fiyat */}
                  <p className="text-red-500 font-bold text-lg">
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    ₺
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Toplam */}
          <div className="bg-slate-50 rounded-3xl shadow p-4 mb-4">
            
            {/* Eski toplam */}
            {order.originalTotal && (
              <p className="text-gray-400 line-through text-sm">
                {order.originalTotal.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}{" "}
                ₺
              </p>
            )}

            {/* Yeni toplam */}
            <h2 className="font-bold text-2xl text-red-500">
              {t(UI_TEXT.total)}:{" "}
              {order.total.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}{" "}
              ₺
            </h2>
          </div>

          {/* Durumlar */}
          <div className="flex flex-wrap gap-4 text-sm">
            
            <span className="bg-slate-50 shadow rounded-3xl px-3 py-2">
              💳 {t(UI_TEXT.payment)}:{" "}
              {order.paid ? (
                <span className="text-green-600 font-semibold">
                  Onaylandi
                </span>
              ) : (
                <span className="text-yellow-600 font-semibold">
                  {t(UI_TEXT.pending)}
                </span>
              )}
            </span>

            <span className="bg-slate-50 rounded-3xl shadow px-3 py-2">
              📦 Status:{" "}
              <span className="font-semibold">
                {order.deliveryStatus ===
                  "hazirlaniyor" &&
                  t(UI_TEXT.preparing)}

                {order.deliveryStatus ===
                  "kargoda" &&
                  t(UI_TEXT.shipped)}

                {order.deliveryStatus ===
                  "teslim_edildi" &&
                  t(UI_TEXT.delivered)}
              </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}