import { Request, Response } from "express";
import { BadRequestError } from "../common/errors/bad-request-error";
import { noteModel } from "../models/note.model";
import { NotFoundError } from "../common/errors/not-found-error";
import { userModel } from "../models/user.model";

export async function createNoteHandler(req: Request, res: Response, next) {
  try {
    const user = req.currentUser?.id;

    const newNote = await noteModel.create({ user, ...req.body });

    res.send(newNote);
  } catch (error) {
    res.status(404).send({ message: "Failed to create a note!" });
  }
}

export async function getNotes(req: Request, res: Response) {
  const user = req.currentUser?.id;
  try {
    const { trash, favorites } = req.query;
    let query = {};
    if (favorites) query["favorite"] = true;
    const notes = await noteModel.find({
      folder: null,
      trash: trash ?? false,
      user,
      ...query,
    });
    res.send(notes);
  } catch (error) {
    res.status(404).send({ message: "No any notes found!" });
  }
}

export async function getNoteById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const note = await noteModel.findById(id);
    res.send(note);
  } catch (error) {
    res.status(404).send({ message: "Note doesn't exists!" });
  }
}
export async function updateNoteHandler(req: Request, res: Response, next) {
  try {
    const { id } = req.params;
    const { folder } = req.body;

    const _note = await noteModel.findById(id);

    for (const key in req.body) _note![key] = req.body[key];
    const updatedNote = await _note?.save();
    res.send(updatedNote);
  } catch (error) {
    res.status(404).send({ message: "Failed to update a note!" });
  }
}

export async function trashNoteHandler(req: Request, res: Response, next) {
  const user = req.currentUser?.id;
  const { id } = req.params;

  try {
    const existNote = await noteModel.findById(id);
    if (!existNote || !existNote.isAdmin(user!)) {
      next(new NotFoundError("Note doesn't exists!"));
      return;
    }
    await existNote.moveToTrash();
    res.end();
  } catch (error) {
    next(new BadRequestError("Failed to delete!"));
  }
}

export async function restoreTrashNoteHandler(
  req: Request,
  res: Response,
  next
) {
  const user = req.currentUser?.id;
  const { id } = req.params;
  try {
    const existNote = await noteModel.findById(id);
    if (!existNote || !existNote.trash || !existNote.isAdmin(user!)) {
      // stop delete if item is not in trash
      next(new NotFoundError("Note doesn't exists anymore!"));
      return;
    }
    await existNote.restoreFromTrash();
    res.end();
  } catch (error) {
    next(new BadRequestError("Failed to restore!"));
  }
}

/// ========================================
/// ============== DELETE ZONE =============
/// ========================================

export async function deleteNoteHandler(req: Request, res: Response, next) {
  const user = req.currentUser?.id;
  const { id } = req.params;
  const { force } = req.body;
  try {
    const existNote = await noteModel.findById(id);
    if (
      !existNote ||
      (!force && !existNote.trash) ||
      !existNote.isAdmin(user!)
    ) {
      // stop delete if note is not in trash & not force
      next(new NotFoundError("Note doesn't exists!"));
      return;
    }
    await existNote.deletePermanently();
    res.end();
  } catch (error) {
    next(new BadRequestError("Failed to delete!"));
  }
}

export async function clearTrashHandler(req: Request, res: Response, next) {
  const user = req.currentUser?.id;
  try {
    const trashNotes = await noteModel.find({ trash: true, user });
    for await (const note of trashNotes) {
      await note.delete();
    }

    res.end();
  } catch (error) {
    next(new BadRequestError("Failed to delete!"));
  }
}

/// ============================
