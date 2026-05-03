import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 👤 Giriş yapan kullanıcının bilgileri
router.get("/me", requireAuth, (req, res) => {
  res.json({
    user:{
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    name: `${req.user.firstName} ${req.user.lastName}`,
    email: req.user.email,
    phone: req.user.phone,
    address: req.user.address,
    }
  });
});

export default router;
