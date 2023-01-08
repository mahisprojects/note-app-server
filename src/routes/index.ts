import { Router } from "express";
import { NotFoundError } from "common/errors/not-found-error";
import { errorHandler } from "common/middleware/error-handler";

import express from "express";
import AccountRouter from "./account.routes";
import UserRouter from "./user.routes";
import FolderRoutes from "./folder.routes";
import NoteRoutes from "./note.routes";
// import TagsRoutes from "./tag.routes";

const Routes = Router();

Routes.use("/cdn", express.static("./content"));

Routes.use("/api/account", AccountRouter);
Routes.use("/api", UserRouter);
Routes.use("/api", FolderRoutes);
Routes.use("/api", NoteRoutes);

Routes.all("/", async (req, res) => {
  res.send({
    server: {
      name: "Note Server",
      status: "Running",
      version: process.env.npm_package_version ?? "1.0.0",
      nodeVersion: `NodeJS - ${process.versions.node}`,
    },
  });
});

Routes.all("*", (req, res) => {
  throw new NotFoundError();
});

Routes.use(errorHandler);

export default Routes;
