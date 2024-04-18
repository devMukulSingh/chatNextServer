import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import { createServer } from "http";
import { Server } from "socket.io";
import { BASE_URL_CLIENT } from "./lib/BASE_URL";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: BASE_URL_CLIENT,
    credentials:true,
    
  },
});

const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use(`/api/auth`, authRoutes);
app.use(`/api/user`, userRoutes);
app.use(`/api/message`, messageRoutes);

server.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
    }
  });

  socket.on("send-msg", (message) => {
    const receiverSocket = onlineUsers.get(message.receiverId);

    if (!receiverSocket) console.log("receiverSocket is required");

    if (message) {
      console.log("at send message ", onlineUsers, receiverSocket);
      socket.to(receiverSocket).emit("receive-msg", message);
    }
  });
});
