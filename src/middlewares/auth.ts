import { Request, Response, NextFunction } from "express";
import { isAuth } from "../lib/jwt";

export default async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies;
    let isAuthenticated;
    // console.log(token,"token");

    // if (!token || token==="") {
    //   const Response = res.status(403).json({ error: "Uncauthenticated" })
    //   res.redirect("/");
    //   return Response;
    // }
    // isAuthenticated = await isAuth(token);
    // console.log(isAuthenticated, "isAuthenticated");

    // if (!isAuthenticated) {
    //   const Response = res.status(403).json({error:"Uncauthenticated"})
    //   res.redirect("/");
    //   return Response;
    // }

    next();
  } catch (e) {
    console.log(e);
    console.log(`Error in isAuth ${e}`);
  }
}
