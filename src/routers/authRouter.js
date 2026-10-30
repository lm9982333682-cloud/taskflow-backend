import { Router } from "express";
import authController from '../controllers/authController.js'
import authValidator from "../validator/authValidator.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register",
    authValidator.register,
    authController.register);



authRouter.post("/login",
    authValidator.login,
    authController.login);

authRouter.post("/refresh", authController.refresh);

authRouter.post("/logout", authMiddleware, authController.logout);
authRouter.get("/me", authMiddleware, authController.getMe);

authRouter.post("/google", authController.googleLogin);

export default authRouter;