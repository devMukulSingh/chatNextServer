import { Router } from "express";
import {
  checkUserController,
  logoutUserController,
  sendOtpController,
  verifyOtpController,
} from "../controllers/authControllers";

const authRoutes = Router();

authRoutes.post(`/send-otp`, sendOtpController);
authRoutes.patch(`/verify-otp`, verifyOtpController);
authRoutes.get(`/check-user`, checkUserController);
authRoutes.get(`/logout-user`, logoutUserController);

// authRoutes.put(`/upate-user`,updateUserController);

export default authRoutes;
