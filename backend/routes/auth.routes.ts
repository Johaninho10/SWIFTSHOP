import { Router } from "express";
import {
  sendVerificationOTP,
  signIn,
  signOut,
  signUp,
  verifyEmail,
} from "../controllers/auth.controller";

// Creating an express router
const authRouter = Router();

// Endpoints
authRouter.post("/signup", signUp);
authRouter.post("/send-verification-otp", sendVerificationOTP);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);

export default authRouter;
