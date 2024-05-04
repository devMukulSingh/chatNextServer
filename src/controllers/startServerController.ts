import { NextFunction, Request, Response } from "express"


export const startServerController = async(req:Request,res:Response,next:NextFunction) => {
    res.status(200).json("Server started");
}