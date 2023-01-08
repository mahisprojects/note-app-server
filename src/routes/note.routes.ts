import express from "express";
import { verifyToken } from "../common/middleware/verifyToken";
import { requireAuthentication } from "../common/middleware/require-auth";

import {
  createNoteHandler,
  deleteNoteHandler,
  getNoteById,
  getNotes,
  trashNoteHandler,
  updateNoteHandler,
} from "../controllers//note.controller";
import Storage from "../common/middleware/storage";

const router = express.Router();

const userAreaHandler = [verifyToken, requireAuthentication];

router.get("/notes", userAreaHandler, getNotes);

router.get("/note/:id", userAreaHandler, getNoteById);
router.post("/note/new", userAreaHandler, createNoteHandler);
router.patch("/note/:id", userAreaHandler, updateNoteHandler);

router.delete("/note/:id/trash", userAreaHandler, trashNoteHandler);
router.delete("/note/:id", userAreaHandler, deleteNoteHandler);

export default router;
