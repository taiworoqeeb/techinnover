import mongoose, { Document, Types, SchemaTypes} from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductStatus } from "src/enums/product.enum";
import { User } from "src/user/entities/user.entity";

export type ProductDocument = Product & ProductInterface & Document

export interface ProductInterface extends Document {
    _id: string;
    userId: Types.ObjectId & string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    status: string
}

@Schema({ timestamps: true })
export class Product extends Document{

    @Prop({type: SchemaTypes.ObjectId, ref: User.name, required: true })
    userId: User;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: Number, required: true })
    quantity: number;

    @Prop({ type: String, required: true, default: ProductStatus.PENDING })
    status: ProductStatus;

    _doc: any
}

export const ProductSchema = SchemaFactory.createForClass(Product)
