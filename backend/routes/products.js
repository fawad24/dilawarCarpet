import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


const router = express.Router();

// 🔹 Tüm ürünleri getir
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Ürünler alınamadı" });
  }
});

// 🔹 Tek ürün detay
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Ürün alınamadı" });
  }
});

// 🔹 Yeni ürün oluştur (adminOnly)
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 6),
  async (req, res) => {
    try {
      const images = req.files.map(file => `/uploads/${file.filename}`);

      const newProduct = await Product.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        images,
      });

      res.status(201).json(newProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ürün oluşturulamadı" });
    }
  }
);


// 🔹 Ürün güncelle (adminOnly)
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 6),
  async (req, res) => {
    try {
      const updateData = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      };

      // yeni resim geldiyse
      if (req.files && req.files.length > 0) {
        updateData.images = req.files.map(f => `/uploads/${f.filename}`);
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: "Ürün güncellenemedi" });
    }
  }
);


// 🔹 Ürün sil (adminOnly)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json({ message: "Ürün silindi" });
  } catch (err) {
    res.status(500).json({ message: "Ürün silinemedi" });
  }
});

export default router;
