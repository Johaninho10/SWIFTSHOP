import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../lib/nodemailer";
import verficationEmail from "../emails/verification-email";

type Inputs = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

const generateOTP = () => {
  return `${Math.floor(Math.random() * 900000 + 100000)}`;
};

// Sign Up Controller
export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstname, lastname, email, password }: Inputs = req.body;

    if (
      !firstname?.trim() ||
      !lastname?.trim() ||
      !email?.trim() ||
      !password?.trim()
    ) {
      throw new Error("All fields are required!");
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new Error("Invalid email format!");
    }

    if (password.length < 6) {
      throw new Error("Password must contain at least 4 caracters");
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new Error("Email already taken!");
    }

    const pendingUser = await prisma.pendingUser.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    let OTP;
    const html = verficationEmail;

    if (pendingUser) {
      OTP = generateOTP();
      await prisma.pendingUser.update({
        where: {
          email,
        },
        data: {
          verificationOTP: OTP,
          verificationOTPExpiresAt: `${Date.now() + 15 * 60 * 60 * 1000}`,
        },
      });

      const mailOptions = {
        from: process.env.GOOGLE_USER,
        to: pendingUser.email,
        subject: "Verification OTP",
        html: html
          .replace("{{firstname}}", pendingUser.firstname)
          .replace("{{lastname}}", pendingUser.lastname)
          .replace("{{OTP}}", pendingUser.verificationOTP),
      };

      await transporter.sendMail(mailOptions);

      const token = jwt.sign(
        { userId: pendingUser.id },
        String(process.env.JWT_SECRET_KEY),
        { expiresIn: "1d" },
      );

      res
        .status(200)
        .cookie("OTPToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "PRODUCTION",
          sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json({
          success: true,
          message: "Verification code sent!",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    OTP = generateOTP();

    const newUser = await prisma.pendingUser.create({
      data: {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.toLocaleLowerCase(),
        password: hashedPassword,
        verificationOTP: OTP,
        verificationOTPExpiresAt: `${Date.now() + 15 * 60 * 60 * 1000}`,
      },
    });

    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to: newUser.email,
      subject: "Verification OTP",
      html: html
        .replace("{{firstname}}", newUser.firstname)
        .replace("{{lastname}}", newUser.lastname)
        .replace("{{OTP}}", newUser.verificationOTP),
    };

    const token = jwt.sign(
      { userId: newUser.id },
      String(process.env.JWT_SECRET_KEY),
      { expiresIn: "1d" },
    );

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .cookie("OTPToken", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
      })
      .json({
        success: true,
        message: "User created successfully!",
      });
  },
);

// Send Verification OTP Controller
export const sendVerificationOTP = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { OTPToken } = req.cookies;

    if (!OTPToken) {
      res.status(400);
      throw new Error("No token provided");
    }

    const { userId } = jwt.verify(OTPToken, String(process.env.JWT_SECRET_KEY));

    const user = await prisma.pendingUser.findUnique({
      where: {
        id: String(userId),
      },
    });

    if (!user) {
      throw new Error("User not found!");
    }

    const OTP = generateOTP();
    const html = verficationEmail;

    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to: user.email,
      subject: "Verification OTP",
      html: html
        .replace("{{firstname}}", user.firstname)
        .replace("{{lastname}}", user.lastname)
        .replace("{{OTP}}", user.verificationOTP),
    };

    await transporter.sendMail(mailOptions);

    await prisma.pendingUser.update({
      where: {
        id: String(userId),
      },
      data: {
        verificationOTP: OTP,
        verificationOTPExpiresAt: `${Date.now() + 15 * 60 * 60 * 1000}`,
      },
    });

    res.status(200).json({
      success: true,
      message: "Verification email sent to your email",
    });
  },
);

// Verify Email Controller
export const verifyEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { OTPToken } = req.cookies;
    const { OTP } = req.body;

    if (!OTPToken) {
      throw new Error("No token provided");
    }

    if (!OTP) {
      throw new Error("No Code sent");
    }

    const { userId } = jwt.verify(OTPToken, String(process.env.JWT_SECRET_KEY));

    const user = await prisma.pendingUser.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found!");
    }

    if (user.verificationOTP !== OTP) {
      throw new Error("Incorrect Code");
    }

    if (Date.now() > Number(user.verificationOTPExpiresAt)) {
      throw new Error("Code expired. Ask for a new code");
    }

    const { firstname, lastname, email, password } = user;

    await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password,
      },
    });

    await prisma.pendingUser.delete({
      where: {
        id: String(userId),
      },
    });

    res
      .status(201)
      .clearCookie("OTPToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
      })
      .json({
        success: true,
        message: "Email verified successfully!",
      });
  },
);

// Sign In Controller
export const signIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string; password: string } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("Incorrect email or password");
    }

    const token = jwt.sign(
      { userId: user.id },
      String(process.env.JWT_SECRET_KEY),
      { expiresIn: "7d" },
    );

    const { password: pass, ...userWithoutPassword } = user;

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
      })
      .json({
        success: true,
        message: "Signed In successfully!",
        user: userWithoutPassword,
      });
  },
);

// Sign Out Controller
export const signOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Hey");

    res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
      })
      .json({
        success: true,
        message: "Signed Out successfully!",
      });
  },
);
