import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userWishlistRoutes from "./routes/userWishlistRoutes.js";
import mpesaRoutes from "./routes/mpesaRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { Message } from "./models/Message.js";

dotenv.config();
const port = process.env.PORT || 8001;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/api/users", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/user/userWishlist", userWishlistRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/mpesa", mpesaRoutes);

sequelize.sync().then(() => console.log("✅ DB connected and synced"));

/**
 * 🔐 ONE roomId rule everywhere
 */
const getRoomId = (a, b) => {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
};

// ✅ HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", ({ buyerId, vendorId }) => {
    const roomId = getRoomId(buyerId, vendorId);
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("sendMessage", async (msgData) => {
    try {
      const { senderId, receiverId, content, type = "normal" } = msgData;

      const roomId = getRoomId(senderId, receiverId);

      const savedMessage = await Message.create({
        senderId,
        receiverId,
        content,
        roomId,
        type,
      });

      io.to(roomId).emit("receiveMessage", savedMessage);
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
