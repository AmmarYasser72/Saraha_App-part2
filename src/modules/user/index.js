import { Router } from "express";
import { getProfile } from "./user.controller.js";
import { authMiddleware, authorize } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "User route working" });
});

router.get("/profile", authMiddleware, getProfile);

router.get(
  "/admin",
  authMiddleware,
  authorize("admin"),
  (req, res) => {
    res.json({ message: "Welcome admin" });
  }
);

export default router;