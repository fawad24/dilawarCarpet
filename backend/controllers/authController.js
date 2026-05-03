import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { firstName,lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email zaten kayıtlı" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ firstName, lastName,email, password: hashedPassword });

    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kayıt başarısız" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Kullanıcı bulunamadı" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Şifre yanlış" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", path:"/" }).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Giriş başarısız" });
  }
};
export const getMe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Yetkisiz" });
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Kullanıcı çekilemedi" });
  }
};
