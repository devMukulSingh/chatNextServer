import { Router } from "express";
import { addUserControllers, checkUserController } from "../controllers/authControllers";


const authRoutes = Router();

authRoutes.post(`/add-user`,addUserControllers);
authRoutes.get(`/check-user`,checkUserController);
// authRoutes.put(`/upate-user`,updateUserController);

export default authRoutes;