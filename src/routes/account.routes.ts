import { Router } from "express";
import { requireAuthentication } from "../common/middleware/require-auth";
import { verifyToken } from "../common/middleware/verifyToken";
import userController from "../controllers//user.controller";

const router = Router();

const userAreaHandler = [verifyToken, requireAuthentication];

router.get("/me", userAreaHandler, userController.currentUserHandler);

router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);

router.patch("/update", userAreaHandler, userController.updateUser);

router.post(
  "/authenticate-password",
  userAreaHandler,
  userController.confirmPassword
);

export default router;
