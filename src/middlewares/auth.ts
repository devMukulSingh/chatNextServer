import { Request, Response, NextFunction } from "express";
import { isAuth } from "../lib/jwt";

export default async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.authorization
    let isAuthenticated;

    if (!token || token==="") {
      const Response = res.status(403).json({ error: "Unauthenticated" })
      res.redirect("/");
      return Response;
    }
    isAuthenticated = await isAuth(token);

    if (!isAuthenticated) {
      const Response = res.status(403).json({error:"Uncauthenticated"})
      res.redirect("/");
      return Response;
    }

    next();
  } catch (e) {
    console.log(e);
    console.log(`Error in isAuth ${e}`);
  }
}
