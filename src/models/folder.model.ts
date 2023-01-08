import fs from "fs/promises";
import { User } from "./user.model";
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
        delete ret.encrypted;
      },
    },
  },
  options: {
    enableMergeHooks: true, // needs to be set, because by default typegoose does not need de-duplication
  },
})
export class Folder {
  @prop({ required: true })
  public name!: string;

  @prop({ ref: () => Folder, required: false })
  public parent?: Ref<Folder>;

  //! Next - feature work
  @prop({ required: false })
  public icon?: string;

  // @prop({ default: 0 })
  // public noteCount?: number;

  @prop({ ref: () => User, required: false })
  public user?: Ref<User>;

  // @nextFeature
  // @prop({ default: false, required: false })
  // public trash?: boolean;
  // public async moveToTrash(this: DocumentType<Folder>) {
  //   this.trash = true;
  //   return await this.save();
  // }
  // public async restoreFromTrash(this: DocumentType<Folder>) {
  //   this.trash = false;
  //   return await this.save();
  // }

  public isAdmin(this: DocumentType<Folder>, userID: String) {
    if (this.user != null) return this.user?.toString() === userID;
    return false;
  }
}

export const folderModel = getModelForClass(Folder);
