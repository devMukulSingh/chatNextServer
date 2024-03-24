import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function addUserControllers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, name, password } = req.body;
    console.log(email, name, password);

    if (!email) {
      res.status(400).json({ error: "email is required" });
      return;
    }
    if (!password) {
      res.status(400).json({ error: "password is required" });
      return;
    }
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      {
        email,
        name,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    res
      .status(200)
      .cookie("token", token)
      .json({ ...user, token });
  } catch (e) {
    next(e);
  }
}

export async function checkUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const password = req.query.password?.toString();
    const email = req.query.email?.toString();

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }
    if (!password) {
      res.status(400).json({ error: "password is required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    if (user.password) {
      const isPasswordCorect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorect) {
        res.status(400).json({ error: "Invalid credentials" });
        return;
      }
    }

    const token = jwt.sign(
      {
        email,
        name: user.name,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      },
    );

    res
      .status(200)
      .cookie("token", token)
      .json({ ...user, token });
  } catch (e) {
    next(e);
  }
}

export async function logoutUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.status(200).cookie("token", "").json("Logout success");
    return;
  } catch (e) {
    next(e);
  }
}
