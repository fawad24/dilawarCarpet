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

  // 🔥 SAFE CART
  const safeCart = Array.isArray(cart) ? cart : [];

  // 🔥 TOTAL (CRASH SAFE)
  const total = safeCart.reduce((sum, item) => {
    const price =
      Number(item.price ?? item.productId?.price ?? 0);

    const qty = Number(item.quantity ?? 1);

    return sum + price * qty;
  }, 0);

  const originalTotal = safeCart.reduce((sum, item) => {
    const price =
      Number(item.originalPrice ?? item.price ?? item.productId?.price ?? 0);

    const qty = Number(item.quantity ?? 1);

    return sum + price * qty;
  }, 0);

  const handleOrder = async () => {
    try {
      if (!user) {
        alert(t(UI_TEXT.mustLogin));
        return;
      }

      const items = safeCart
        .map((item) => {
          const product = item.productId || item;

          if (!product) return null;

          return {
            productId: product._id || item._id,
            name: product.name || item.name || "Product",
            price: Number(item.price ?? product.price ?? 0),
            originalPrice: Number(
              item.originalPrice ?? product.price ?? item.price ?? 0
            ),
            quantity: Number(item.quantity ?? 1),
          };
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
    <div className="max-w-4xl mx-auto mt-28 p-4 bg-slate-200 shadow rounded-2xl">

      <h1 className="text-2xl font-bold mb-6">
        🧾 {t(UI_TEXT.orderSummary)}
      </h1>

      {safeCart.map((item, i) => {
        const price = Number(item.price ?? 0);
        const qty = Number(item.quantity ?? 1);

        return (
          <div
            key={item._id || i}
            className="flex justify-between bg-slate-50 p-3 rounded-3xl shadow mb-2"
          >
            <div>
              <p className="font-bold">
                {item.name ?? item.productId?.name ?? "Product"}
              </p>

              <p className="text-sm text-gray-400">
                {(item.originalPrice ?? 0) > price && (
                  <span className="line-through">
                    {item.originalPrice} ₺
                  </span>
                )}
              </p>

              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                Kurban Bayramı İndirimi
              </span>
            </div>

            <div className="text-red-500 font-bold">
              {(price * qty).toLocaleString("tr-TR")} ₺
            </div>
          </div>
        );
      })}

      <div className="mt-4 bg-slate-50 p-4 rounded-3xl shadow">
        <p className="text-gray-400 line-through">
          {originalTotal.toLocaleString("tr-TR")} ₺
        </p>

        <h2 className="text-2xl font-bold text-red-500">
          {t(UI_TEXT.total)}: {total.toLocaleString("tr-TR")} ₺
        </h2>
      </div>

      <button
        onClick={handleOrder}
        className="mt-6 w-full bg-lime-500 text-white font-bold py-3 rounded-3xl"
      >
        {t(UI_TEXT.confirmOrder)}
      </button>
    </div>
  );
}