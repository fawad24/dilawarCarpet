import express from "express";
import Order from "../models/Order.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🌍 BASE URL (Docker + Nginx uyumlu)
const BASE_URL = process.env.BASE_URL;

/* =========================
   🛒 SİPARİŞ OLUŞTUR
========================= */
router.post("/", requireAuth, async (req, res) => {
  try {
    const order = await Order.create({
      user: req.user._id,
      shippingInfo: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        address: req.user.address || "",
        phone: req.user.phone || "",
      },
      items: req.body.items,
      total: req.body.total,
      paymentMethod: req.body.paymentMethod,
      paid: false,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    res.status(500).json({ message: "Sipariş oluşturulamadı" });
  }
});
 
// tum siparisler
router.get("/", requireAuth,adminOnly, async (req, res) => {
  try {
    

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.productId")
      .populate("user", "firstName lastName email address phone");

    const ordersWithImages = orders.map(order => ({
      ...order._doc,
      user: order.user || {}, // 🔥 safety fix
      items: order.items.map(i => ({
        id: i.productId?._id,
        name: i.productId?.name || "Ürün silinmiş",
        price: i.productId?.price || 0,
        images: i.productId?.images?.map(img =>
          img.startsWith("http") ? img : `${BASE_URL}${img}`
        ) || [],
        quantity: i.quantity,
      })),
    }));

    res.json(ordersWithImages);
  } catch (err) {
    console.error("ADMIN ORDERS ERROR:", err);
    res.status(500).json({ message: "Siparişler alınamadı" });
  }
});



/* =========================
   👤 USER - KENDİ SİPARİŞLERİ
========================= */
router.get("/my", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.productId");

    const ordersWithImages = orders.map(order => ({
      ...order._doc,
      items: order.items.map(i => ({
        id: i.productId?._id,
        name: i.productId?.name || "Ürün silinmiş",
        price: i.productId?.price || 0,
        images: i.productId?.images?.map(img =>
          img.startsWith("http") ? img : `${BASE_URL}${img}`
        ) || [],
        quantity: i.quantity,
      })),
    }));

    res.json(ordersWithImages);
  } catch (err) {
    console.error("MY ORDERS ERROR:", err);
    res.status(500).json({ message: "Siparişler getirilemedi" });
  }
});

/* =========================
   💰 ÖDEME GÜNCELLE (ADMIN)
========================= */
router.post("/:id/pay", requireAuth, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Sipariş bulunamadı" });

    

    order.paid = true;
    await order.save();

    res.json({ message: "Ödeme alındı", order });
  } catch (err) {
    console.error("PAY ERROR:", err);
    res.status(500).json({ message: "Bir hata oluştu" });
  }
});

/* =========================
   📦 TESLİMAT DURUMU (ADMIN)
========================= */
router.put("/:id/delivery", requireAuth,adminOnly, async (req, res) => {
  try {
    

    const { deliveryStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Sipariş bulunamadı" });

    order.deliveryStatus = deliveryStatus;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error("DELIVERY UPDATE ERROR:", err);
    res.status(500).json({ message: "Durum güncellenemedi" });
  }
});

export default router;