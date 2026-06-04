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
    console.log("CART:", cart);
    const { t } = useTranslation();

  const [paymentMethod, setPaymentMethod] = useState("iban");

  const total = cart.reduce(
    (sum, item) =>
      sum + (item.productId?.price || 0) * (item.quantity || 1),
    0
  );

  const handleOrder = async () => {
  try {
    if (!user) {
      alert(t(UI_TEXT.mustLogin));
      return;
    }

    const items = cart.map(item => {
      if (item.productId && item.productId._id) {
        return {
          productId: item.productId?._id || item.id,
          name: item.productId?.name || item.name,
          price: item.productId?.price || item.price,
          quantity: item.quantity || 1,
        };
      }

      if (item._id && item.name && item.price) {
        return {
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        };
      }

      return null;
    }).filter(Boolean);

    if (!items.length) {
      alert("Sepet boş");
      return;
    }

    // ✅ EKSİK OLAN TEK ŞEY BUYDU
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
    alert(t(UI_TEXTgenericError));
  }
};


  return (
    <div className="max-w-4xl lg:mx-auto mx-4 mt-28 lg:p-8 p-2 bg-slate-200 shadow rounded-2xl">
      <h1 className="text-2xl font-bold mb-6">🧾 {t(UI_TEXT.orderSummary)}</h1>

      {cart.map(item => (
    <div
      key={item._id}   // 🔴 _id KALDI (cart item id)
      className="border-b py-2 px-3 flex justify-between bg-slate-50 rounded-3xl shadow font-bold"
    >
      <span>
        {item.productId.name} × {item.quantity}
      </span>
      <span>
        {item.productId.price} ₺
      </span>
    </div>
))}

      <div className="mt-4 font-bold rounded-3xl shadow bg-slate-50 px-1 py-2">{t(UI_TEXT.total)}: {total} ₺</div>

      <div className="mt-6 bg-slate-50 rounded-3xl px-2 py-3 shadow">
        <h2 className="font-semibold mb-2">{t(UI_TEXT.paymentMethod)}</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="iban">
            <input
              type="radio"
              id="iban"
              name="paymentMethod"
              checked={paymentMethod === "iban"}
              onChange={() => setPaymentMethod("iban")}
            />{" "}
            {t(UI_TEXT.payWithIban)}
          </label>

          <label htmlFor="kapida">
            <input
              type="radio"
              id="kapida"
              name="paymentMethod"
              checked={paymentMethod === "kapida"}
              onChange={() => setPaymentMethod("kapida")}
            />{" "}
            {t(UI_TEXT.payAtDoor)}
          </label>
        </div>
      </div>

      {paymentMethod === "iban" && (
        <div className="mt-4 bg-yellow-100 p-3 rounded-3xl shadow">
          <p className="font-semibold">{t(UI_TEXT.ibanInfo)}</p>
          <p>TR00 0000 0000 0000 0000 0000 00</p>
          <p>{t(UI_TEXT.ibanDescription)}</p>
        </div>
      )}

      <button
        onClick={handleOrder}
        className="mt-6 bg-slate-50 shadow  px-6 py-2 rounded-3xl hover:bg-white text-lime-500 font-bold"
      >
        {t(UI_TEXT.confirmOrder)}
      </button>
    </div>
  );
}
