import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(`/api/auth`,authRoutes);
app.use(`/api/user`,userRoutes);
app.use(`/api/message`,messageRoutes)

app.get(`/`,(req,res) => {
    res.send(`Hell from server`);
})

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);  
});