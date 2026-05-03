import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: "fawaddilawar24@gmail.com" });
    if (existing) {
      console.log("Admin zaten mevcut");
      process.exit();
    }

    const admin = await User.create({
      firstName: "Fawad",
      lastName: "Dilawar",
      email: "fawaddilawar24@gmail.com",
      password: await bcrypt.hash("StrongAdmin123!", 12),
      role: "admin"
    });

    console.log("✅ Admin oluşturuldu:", admin.email);
    process.exit();
  } catch (err) {
    console.error("❌ Hata:", err);
    process.exit(1);
  }
};

createAdmin();
