import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "../context/TranslationContext";
import { UI_TEXT } from "../config/uiText";

export default function Checkout() {
  const API_URL = import.meta.env.VITE_API_URL + "/api";

  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [paymentMethod, setPaymentMethod] = useState("iban");

  // 🔥 SAFE TOTAL (CRASH FIX)
  const total = cart.reduce(
    (sum, item) =>
      sum +
      ((item.price ?? item.productId?.price ?? 0) *
        (item.quantity || 1)),
    0
  );

  const originalTotal = cart.reduce(
    (sum, item) =>
      sum +
      (((item.originalPrice ?? item.productId?.price ?? item.price) || 0) *
        (item.quantity || 1)),
    0
  );

  const handleOrder = async () => {
    try {
      if (!user) {
        alert(t(UI_TEXT.mustLogin));
        return;
      }

      const items = cart
        .map((item) => {
          if (item._id && item.name) {
            return {
              productId: item._id,
              name: item.name,
              price: item.price ?? item.productId?.price ?? 0,
              originalPrice:
                item.originalPrice ?? item.productId?.price ?? item.price ?? 0,
              quantity: item.quantity || 1,
            };
          }

          if (item.productId && item.productId._id) {
            return {
              productId: item.productId._id,
              name: item.productId.name,
              price: item.price ?? item.productId.price ?? 0,
              originalPrice:
                item.originalPrice ?? item.productId.price ?? 0,
              quantity: item.quantity || 1,
            };
          }

          return null;
        })
        .filter(Boolean);

      if (!items.length) {
        alert("Sepet boş");
        return;
      }

      const orderData = {
        userId: user._id,
        customer: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
        items,
        total,
        originalTotal,
        paymentMethod,
        paymentStatus: "paid",
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        alert(t(UI_TEXT.orderFailed));
        return;
      }

      alert(t(UI_TEXT.orderSuccess));
      clearCart();
      navigate("/orders", { replace: true });

    } catch (err) {
      console.error(err);
      alert(t(UI_TEXT.genericError));
    }
  };

  return (
    <div className="max-w-4xl lg:mx-auto mx-4 mt-28 lg:p-8 p-2 bg-slate-200 shadow rounded-2xl">

      <h1 className="text-2xl font-bold mb-6">
        🧾 {t(UI_TEXT.orderSummary)}
      </h1>

      {cart.map((item) => {
        const price = item.price ?? item.productId?.price ?? 0;
        const original = item.originalPrice ?? item.productId?.price ?? price;

        return (
          <div
            key={item._id}
            className="border-b py-3 px-3 flex justify-between items-center bg-slate-50 rounded-3xl shadow font-bold mb-2"
          >
            <div>
              <span className="block">
                {item.name} × {item.quantity}
              </span>

              {/* 🔥 NORMAL FİYAT (ÜSTÜ ÇİZİLİ) */}
              {original > price && (
                <span className="text-gray-400 line-through text-sm block">
                  {original.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} ₺
                </span>
              )}

              {/* 🔥 İNDİRİM ETİKETİ */}
              {original > price && (
                <span className="inline-block mt-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Kurban Bayramı İndirimi
                </span>
              )}
            </div>

            {/* 🔥 İNDİRİMLİ FİYAT (KIRMIZI) */}
            <span className="text-red-500 font-bold text-lg">
              {price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} ₺
            </span>
          </div>
        );
      })}

      {/* TOTAL */}
      <div className="mt-4 bg-slate-50 rounded-3xl shadow px-4 py-4">

        {originalTotal > total && (
          <p className="text-gray-400 line-through text-sm">
            {originalTotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} ₺
          </p>
        )}

        <h2 className="text-2xl font-bold text-red-500">
          {t(UI_TEXT.total)}:{" "}
          {total.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} ₺
        </h2>
      </div>

      {/* PAYMENT */}
      <div className="mt-6 bg-slate-50 rounded-3xl px-4 py-4 shadow">

        <h2 className="font-semibold mb-3">
          {t(UI_TEXT.paymentMethod)}
        </h2>

        <div className="flex flex-col gap-3">

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "iban"}
              onChange={() => setPaymentMethod("iban")}
            />
            {t(UI_TEXT.payWithIban)}
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "kapida"}
              onChange={() => setPaymentMethod("kapida")}
            />
            {t(UI_TEXT.payAtDoor)}
          </label>

        </div>
      </div>

      {/* IBAN */}
      {paymentMethod === "iban" && (
        <div className="mt-4 bg-yellow-100 p-4 rounded-3xl shadow">
          <p className="font-semibold">
            {t(UI_TEXT.ibanInfo)}
          </p>
          <p>TR00 0000 0000 0000 0000 0000 00</p>
          <p className="text-sm mt-2">
            {t(UI_TEXT.ibanDescription)}
          </p>
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleOrder}
        className="mt-6 bg-slate-50 shadow px-6 py-3 rounded-3xl hover:bg-white text-lime-500 font-bold"
      >
        {t(UI_TEXT.confirmOrder)}
      </button>

    </div>
  );
}