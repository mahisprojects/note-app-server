import bcrypt from "bcryptjs";
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
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  },
  options: {
    enableMergeHooks: true, // needs to be set, because by default typegoose does not need de-duplication
  },
})
export class User {
  @prop({})
  public uid!: string; // google generated firebase user ID

  @prop({ required: false })
  public username?: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: false, default: "user" })
  public role?: string;

  @prop({ required: true })
  public password!: string;

  @prop({ default: false, required: false })
  public pro?: boolean;

  @prop({ required: false })
  public proExpire?: Date;

  @prop({ required: false })
  public profile?: string;

  // the "this" definition is required to have the correct types
  public comparePassword(this: DocumentType<User>, inputPassword: string) {
    return bcrypt.compareSync(inputPassword, this.password);
  }
}

export const userModel = getModelForClass(User);
