import express from "express";
import { verifyToken } from "common/middleware/verifyToken";
import { requireAuthentication } from "common/middleware/require-auth";

import NoteStorage from "common/middleware/storage";
import {
  createFolderHandler,
  getFolderById,
  getFolders,
  updateFolderHandler,
} from "controllers/folder.controller";

const router = express.Router();
const storage = new NoteStorage({});

const userAreaHandler = [verifyToken, requireAuthentication];

// DEBUG ONLY
router.get("/folders", userAreaHandler, getFolders);

router.get("/folder/:id", userAreaHandler, getFolderById);
router.post("/folder/new", userAreaHandler, createFolderHandler);
router.patch("/folder/:id", userAreaHandler, updateFolderHandler);

export default router;
