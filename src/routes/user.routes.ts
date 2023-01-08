import { Router } from "express";
import userController, { getUserById } from "controllers/user.controller";
import { authorization } from "common/middleware/authorization";
import { verifyToken } from "common/middleware/verifyToken";
import { requireAuthentication } from "common/middleware/require-auth";
// import { getStorageQuota } from "controllers/note.controller";

const router = Router();

const userAreaHandler = [verifyToken, requireAuthentication];
const adminAreaHandler = [...userAreaHandler, authorization(["admin"])];

// ! only for testing
router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "You can't access this route without successfull authorization.",
  });
});

router.get("/user/:id", userAreaHandler, getUserById);
// router.get("/quota", userAreaHandler, getStorageQuota);

// admin routes
router.get("/users", adminAreaHandler, userController.getUsers);
router.patch("/users/:id", adminAreaHandler, userController.updateUser);
router.delete("/users/:id", adminAreaHandler, userController.deleteUser);

export default router;
