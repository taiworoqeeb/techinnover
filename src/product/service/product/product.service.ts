import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProductStatus } from 'src/enums/product.enum';
import { Product, ProductDocument } from 'src/product/entities/product.entity';
import {ResponseHandler, responseHandler,} from "src/util";

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<ProductDocument>,
    ){}

    async fetchActiveProductsService(): Promise<ResponseHandler>{
        const products = await this.productModel.find({
            status: ProductStatus.ACTIVE
        })

        if(products.length == 0){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "No products found",
                data:{
                    totalProduct: 0,
                    products: []
                }
            })
        }

        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: "Active products fetched successfully",
            data:{
                totalProduct: products.length,
                products: products
            }
        })
    }
}
