import { Router } from "express";
import { getUsersController } from "../controllers/usersController";
import isAuthenticated from "../middlewares/auth";

const userRoutes = Router();

userRoutes.get(`/get-users`, isAuthenticated, getUsersController);

export default userRoutes;
