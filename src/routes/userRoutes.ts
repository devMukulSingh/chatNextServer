import { Router } from "express";
import { getUsersController } from "../controllers/usersController";

const userRoutes = Router();

userRoutes.get(`/get-users`,getUsersController);


export default userRoutes