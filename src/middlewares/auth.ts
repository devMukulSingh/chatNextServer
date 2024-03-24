import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function isAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.cookies;
    console.log(token);
    let isAuthenticated;

    if (token) {
      isAuthenticated = jwt.verify(token, process.env.JWT_SECRET as string);
    }

    if (!isAuthenticated) {
      res.status(403).json({ error: "Unauthenticated" });
      return;
    }

    next();
  } catch (e) {
    console.log(`Error in isAuth ${e}`);
  }
}
