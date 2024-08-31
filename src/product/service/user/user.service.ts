import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProductCreateDTO, ProductUpdateDTO } from 'src/product/dto/product.dto';
import { Product, ProductDocument } from 'src/product/entities/product.entity';
import {ResponseHandler, responseHandler,} from "src/util";


@Injectable()
export class UserProductService{
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<ProductDocument>,
    ){}

    async createProductService(body: ProductCreateDTO, userId: string): Promise<ResponseHandler>{
            const checkProduct = await this.productModel.exists({
                userId: userId,
                name: body.name
            })

            if(checkProduct){
                return responseHandler({
                    status: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Product with this name already exists",
                    data:{}
                })
            }

            await this.productModel.create({
                userId: userId,
                ...body
            })

            return responseHandler({
                status: true,
                statusCode: HttpStatus.OK,
                message: "Product created successfully",
                data: {}
            })
    }

    async fetchProductsService(userId: string): Promise<ResponseHandler>{
        const products = await this.productModel.find({
            userId: userId
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
            message: "User products fetched successfully",
            data:{
                totalProduct: products.length,
                products: products
            }
        })
    }

    async fetchProductByIdService(userId: string, productId: string): Promise<ResponseHandler>{
        const product = await this.productModel.findOne({
            userId: userId,
            _id: productId
        })

        if(!product){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "No product found",
                data:{}
            })
        }

        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: "User product fetched successfully",
            data: product
        })
    }

    async updateProductService(productId: string, userId: string, body: ProductUpdateDTO): Promise<ResponseHandler>{
            const checkproduct = await this.productModel.exists({
                userId: userId,
                _id: productId
            })

            if(!checkproduct){
                return responseHandler({
                    status: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Product not found",
                    data:{}
                })
            }

            const productUpdate = await this.productModel.updateOne({
                _id: productId
            }, {...body})

            if(productUpdate.modifiedCount == 0){
                return responseHandler({
                    status: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Unable to update product",
                    data:{}
                })
            }

            return responseHandler({
                status: true,
                statusCode: HttpStatus.OK,
                message: "Product updated successfully",
                data: {}
            })
    }

    async deleteProductService(productId: string, userId: string): Promise<ResponseHandler>{
        const checkproduct = await this.productModel.exists({
            userId: userId,
            _id: productId
        })

        if(!checkproduct){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Product not found",
                data:{}
            })
        }

        const productUpdate = await this.productModel.deleteOne({
            _id: productId
        })

        if(productUpdate.deletedCount == 0){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Unable to delete product",
                data:{}
            })
        }

        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: "Product deleted successfully",
            data: {}
        })
}
}
