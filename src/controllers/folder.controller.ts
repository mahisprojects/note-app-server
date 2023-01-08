import { Request, Response } from "express";
import { BadRequestError } from "common/errors/bad-request-error";
import { NotFoundError } from "common/errors/not-found-error";
import { folderModel } from "../models/folder.model";
import { noteModel } from "../models/note.model";

export async function createFolderHandler(req: Request, res: Response, next) {
  try {
    const { name, parent } = req.body;
    const user = req.currentUser?.id;
    // check for folder exists or not in same folder
    const _existsFolder = await folderModel.findOne({ name, parent });
    if (_existsFolder) {
      next(new BadRequestError("Duplicate folder at same location"));
      return;
    }

    const folder = await folderModel.create({
      name,
      parent,
      user,
    });

    res.send(folder);
  } catch (error) {
    res.status(404).send({ message: "Failed to create a folder!" });
  }
}

export async function updateFolderHandler(req: Request, res: Response, next) {
  try {
    const { id } = req.params;
    const { name, parent } = req.body;

    const _dir = await folderModel.findById(id);
    // check for folder exists or not in same folder
    if (_dir?.name !== name || _dir?.parent !== parent) {
      const _dirs = await folderModel.find({ name, parent });
      if (_dirs.length !== 0) {
        next(new BadRequestError("Duplicate folder at same location"));
        return;
      }
    }
    for (const key in req.body) _dir![key] = req.body[key];
    const updatedFolder = await _dir?.save();
    res.send(updatedFolder);
  } catch (error) {
    res.status(404).send({ message: "Failed to update a folder!" });
  }
}

export async function getFolderById(req: Request, res: Response) {
  try {
    const { trash } = req.query;
    const { id } = req.params;
    const folder = await folderModel
      .findById(id)
      .populate("parent", "_id name");
    // finde only not trashed folder/files
    const query: {} = {};
    !trash && (query["trash"] = false);
    const notes = await noteModel.find({ folder: id, ...query });

    res.send({ folder: folder?.toJSON(), notes });
  } catch (error) {
    res.status(404).send({ message: "Folder doesn't exists!" });
  }
}

export async function getFolders(req: Request, res: Response, next) {
  const user = req.currentUser?.id;
  try {
    // find trash folder & files if no folder

    const folders = await folderModel.find({ user });
    res.send(folders);
  } catch (error) {
    next(new BadRequestError("Failed to get folders"));
  }
}
