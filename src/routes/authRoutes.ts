import { Router } from "express";
import {
  addUserControllers,
  checkUserController,
  logoutUserController,
} from "../controllers/authControllers";

const authRoutes = Router();

authRoutes.post(`/add-user`, addUserControllers);
authRoutes.get(`/check-user`, checkUserController);
authRoutes.get(`/logout-user`, logoutUserController);

// authRoutes.put(`/upate-user`,updateUserController);

export default authRoutes;
