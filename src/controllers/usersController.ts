import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getObjectURL } from "../aws";

export async function getUsersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let users = await prisma.user.findMany({
      where: {
        isVerified: true,
      },
    });
    for(let user of users){
      if(user.profileImage && user.profileImage !== ""){
        const imageUrl = await getObjectURL(user.profileImage);
        user.profileImage = imageUrl;
      }
    }
    
    return res.status(200).json(users);
  } catch (e) {
    res.status(500).json(e);
    console.log(`Error in getUsersController ${e}`);
    return;
  }
}
