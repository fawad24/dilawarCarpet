import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Çok fazla giriş denemesi yaptınız. Lütfen bekleyin."
});
