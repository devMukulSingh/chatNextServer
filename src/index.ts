import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use(`/api/auth`,authRoutes);

app.get(`/`,(req,res) => {
    res.send(`Hell from server`);
})

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);  
});