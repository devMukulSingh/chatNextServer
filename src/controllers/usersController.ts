import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getUsersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await prisma.user.findMany({});

    res.status(200).json(users);

    return;
  } catch (e) {
    res.status(500).json(`Error in getUsersController ${e}`);
    console.log(`Error in getUsersController ${e}`);
    return;
  }
}
