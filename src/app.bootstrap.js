import express from "express";
import { NODE_ENV, port } from "./config/config.service.js";

import { connectDB } from "./config/connection.db.js";

import authRoutes from "./modules/auth/index.js";
import userRoutes from "./modules/user/index.js";

export default async function bootstrap() {
  const app = express();

  await connectDB();

  // middlewares
  app.use(express.json());

  // serve uploaded images
  app.use("/uploads", express.static("uploads"));

  // test route
  app.get("/", (req, res) => res.send("Hello World"));

  // routes
  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);

  // 404
  app.use((req, res) => {
    return res.status(404).json({ message: "Invalid application routing" });
  });

  // global error handler
  app.use((error, req, res, next) => {
    const status = error.cause?.status || 500;

    return res.status(status).json({
      error_message:
        status === 500
          ? "something went wrong"
          : error.message || "something went wrong",
      stack: NODE_ENV === "development" ? error.stack : undefined,
    });
  });

  // start server
  app.listen(port || 3000, () => {
    console.log(`Server running on port ${port || 3000}`);
  });
}

