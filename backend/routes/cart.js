import express from "express";
import Cart from "../models/Cart.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🌍 BASE URL (Docker + Nginx uyumlu)
const BASE_URL = process.env.BASE_URL;

/* =========================
   🛒 SEPETİ GETİR
========================= */
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id })
      .populate("items.productId");

    if (!cart) return res.json({ items: [] });

    const items = cart.items.map(i => ({
      _id: i._id,
      quantity: i.quantity,
      productId: {
        _id: i.productId?._id,
        name: i.productId?.name,
        price: i.productId?.price,
        images:
          i.productId?.images?.map(img =>
            img.startsWith("http") ? img : `${BASE_URL}${img}`
          ) || [],
      },
    }));

    res.json({ items });
  } catch (err) {
    console.error("CART GET ERROR:", err);
    res.status(500).json({ message: "Sepet alınamadı" });
  }
});

/* =========================
   ➕ ÜRÜN EKLE
========================= */
router.post("/add", protect, async (req, res) => {
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      i => i.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();
    await cart.populate("items.productId");

    const cartWithImages = cart.items.map(i => ({
      id: i.productId?._id,
      name: i.productId?.name,
      price: i.productId?.price,
      images:
        i.productId?.images?.map(img =>
          img.startsWith("http") ? img : `${BASE_URL}${img}`
        ) || [],
      quantity: i.quantity,
    }));

    res.json({ items: cartWithImages });
  } catch (err) {
    console.error("CART ADD ERROR:", err);
    res.status(500).json({ message: "Ürün sepete eklenemedi" });
  }
});

/* =========================
   ❌ ÜRÜN ÇIKAR
========================= */
router.delete("/remove/:productId", protect, async (req, res) => {
  const { productId } = req.params;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) return res.json({ items: [] });

    cart.items = cart.items.filter(
      i => i.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.productId");

    const cartWithImages = cart.items.map(i => ({
      id: i.productId?._id,
      name: i.productId?.name,
      price: i.productId?.price,
      images:
        i.productId?.images?.map(img =>
          img.startsWith("http") ? img : `${BASE_URL}${img}`
        ) || [],
      quantity: i.quantity,
    }));

    res.json({ items: cartWithImages });
  } catch (err) {
    console.error("CART REMOVE ERROR:", err);
    res.status(500).json({ message: "Ürün sepetten çıkarılamadı" });
  }
});

/* =========================
   🧹 SEPETİ TEMİZLE
========================= */
router.delete("/clear", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ items: [] });
  } catch (err) {
    console.error("CART CLEAR ERROR:", err);
    res.status(500).json({ message: "Sepet temizlenemedi" });
  }
});

export default router;