import fs from "fs/promises";
import { User } from "./user.model";
import { Folder } from "./folder.model";
import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Ref,
} from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: "notes-folder",
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.path;
        // TODO @next feature
        delete ret.icon;
        delete ret.locked;
      },
    },
  },
  options: {
    enableMergeHooks: true, // needs to be set, because by default typegoose does not need de-duplication
  },
})
export class Note {
  @prop({ required: true })
  public title!: string;

  @prop({ required: false })
  public body?: string;

  @prop({ required: false, default: false })
  public pinned: boolean;

  @prop({ ref: () => User, required: false })
  public user?: Ref<User>;

  @prop({ ref: () => Folder, required: false })
  public folder?: Ref<Folder>;

  @prop({ ref: () => Note, required: false })
  public tags?: Ref<Note>[];

  @prop({ required: false, default: false })
  public trash: boolean;

  public isAdmin(this: DocumentType<Note>, userID: String) {
    if (this.user != null) return this.user?.toString() === userID;
    return false;
  }

  public async moveToTrash(this: DocumentType<Note>) {
    this.trash = true;
    return await this.save();
  }

  public async restoreFromTrash(this: DocumentType<Note>) {
    this.trash = false;
    return await this.save();
  }

  public async deletePermanently(this: DocumentType<Note>) {
    // implement delete note attachments on attachment upload suport
    await this.delete();
  }
}

export const noteModel = getModelForClass(Note);
