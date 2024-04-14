import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { jwtSign } from "../lib/jwt";
import { User } from "@prisma/client";

export async function sendOtpController(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    const user: User | null = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user?.isVerified === true)
      return res.status(400).json({
        error: "User already exists",
      });

    //sending OTP
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "mukulsingh2276@gmail.com",
        pass: process.env.SMTP_PASS,
      },
    });

    let otp = 0;
    const sendOtp = async () => {
      otp = Math.ceil(Math.random() * 10000);
      const mailOtptions = {
        from: "mukulsingh2276@gmail.com",
        to: email,
        subject: "Verfify your email",
        html: `<h1>Enter the otp ${otp} to verify your email</h1>`,
      };
      await transporter.sendMail(mailOtptions);
    };

    await sendOtp();

    const hashedPassword = await bcrypt.hash(password, 8);
    // const hashedOtp = await bcrypt.hash(otp.toLocaleString(), 8);

    let newUser;
    if (user && user?.isVerified === false) {
      newUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          otp: otp.toString(),
          // otp: hashedOtp,
        },
      });

      return res.status(201).json("Otp sent");
    }
    newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        // otp: hashedOtp,
        otp: otp.toString(),
        name,
      },
    });
    return res.status(201).json("Otp sent");
  } catch (e) {
    console.log(`Error in sendOtp controller ${e}`);
    return res.status(500).json(e);
  }
}

export async function verifyOtpController(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;
    console.log(otp);

    if (!email || email === "") {
      return res.status(400).json({
        error: "Email is required",
      });
    }
    if (!otp || otp === "") {
      return res.status(400).json({
        error: "otp is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "User doesn't exists",
      });
    }
    if (user.otp !== otp) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }
    // const isOtpCorrect = await bcrypt.compare(otp, user.otp)

    // if (!isOtpCorrect) {
    //   return res.status(400).json({
    //     error: "Invalid OTP"
    //   })
    // }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
      },
    });

    const token = await jwtSign();

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(200).json({ ...user, token });
  } catch (e) {
    console.log(`Error in verifyOtpController ${e}`);
    return res.status(500).json(e);
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
        email,
        isVerified: true,
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

    const token = await jwtSign();

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
