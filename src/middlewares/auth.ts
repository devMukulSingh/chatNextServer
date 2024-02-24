import { Request, Response,NextFunction } from "express"
import jwt from "jsonwebtoken";

export default function isAuth(req:Request,res:Response,next:NextFunction){
    
    const {token} = req.cookies();

    const isAuthenticated = jwt.verify(token,process.env.JWT_SECRET as string);

    if(!isAuthenticated){
        res.status(403).json({error:'Unauthenticated'});
        return;
    }

    next();

}