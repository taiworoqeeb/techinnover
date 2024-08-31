import mongoose, {HydratedDocument, Document, Types, SchemaTypes} from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Request } from "express";
import { accountStatus } from "src/enums/status.enum";
import { accountRole } from "src/enums/role.enum";
export type UserDocument = User &  Document;

export interface UserInterface extends Document{
    _id: Types.ObjectId & string;
    name: string;
    email: string;
    password: string;
    status: string,
    createdAt: Date;
    updatedAt: Date;
    _doc?: any
}

export interface CustomRequest extends Request {
    user?: UserInterface;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: String, enum: accountStatus, default: accountStatus.ACTIVE })
  status: accountStatus;

  @Prop({type: String, enum: accountRole, default: accountRole.USER})
  role: accountRole

  _doc: any
}

export const UserSchema = SchemaFactory.createForClass(User);
