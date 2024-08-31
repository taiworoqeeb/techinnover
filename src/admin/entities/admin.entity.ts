import mongoose, {HydratedDocument, Document, Types, SchemaTypes} from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Request } from "express";
import { accountRole } from "src/enums/role.enum";
export type AdminDocument = Admin &  Document;

export interface AdminInterface extends Document{
    _id: Types.ObjectId & string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    _doc?: any
}

export interface CustomRequest extends Request {
    admin?: AdminInterface;
}

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({ type: String, required: true})
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({type: String, enum: accountRole, default: accountRole.ADMIN})
  role: accountRole

  _doc: any
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
