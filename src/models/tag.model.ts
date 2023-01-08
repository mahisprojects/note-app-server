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
    collection: "tags",
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
})
export class NoteTag {
  @prop({ required: true })
  public name!: string;

  // @prop({ default: 0 })
  // public noteCount?: number;

  @prop({ ref: () => User, required: false })
  public user?: Ref<User>;

  public isAdmin(this: DocumentType<NoteTag>, userID: String) {
    if (this.user != null) return this.user?.toString() === userID;
    return false;
  }
}

export const directoryModel = getModelForClass(NoteTag);
