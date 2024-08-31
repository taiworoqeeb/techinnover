import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProductStatus } from 'src/enums/product.enum';
import { ChangeProductStatusDTO, ProductCreateDTO, ProductQueryDTO, ProductUpdateDTO } from 'src/product/dto/product.dto';
import { Product, ProductDocument } from 'src/product/entities/product.entity';
import {queryConstructor, ResponseHandler, responseHandler,} from "src/util";


@Injectable()
export class AdminProductService{
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<ProductDocument>,
    ){}

    async fetchProductsService(query: ProductQueryDTO): Promise<ResponseHandler>{
        const { error, sort, params, limit, skip } = queryConstructor(
            query,
            'createdAt',
            'product',
          );

          if (error) {
            return responseHandler({
              status: false,
              statusCode: HttpStatus.BAD_REQUEST,
              message: error,
              data: [],
            });
          }

        const products = await this.productModel.find({...params}).sort(sort)
        .limit(limit)
        .skip(skip);

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
            message: "Products fetched successfully",
            data:{
                totalProduct: products.length,
                products: products
            }
        })
    }

    async fetchProductByIdService(productId: string): Promise<ResponseHandler>{
        const product = await this.productModel.findById(productId)

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
            message: "Product fetched successfully",
            data: product
        })
    }

    async changeProductStatusService(productId: string, body: ChangeProductStatusDTO): Promise<ResponseHandler>{
        const product = await this.productModel.exists({_id: productId})

        if(!product){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "No product found",
                data:{}
            })
        }

        const updateProduct = await this.productModel.updateOne({_id: productId}, {
            status: body.status
        })

        if(updateProduct.modifiedCount == 0){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Unable to update product status",
                data:{}
            })
        }

        const message =
      body.status == ProductStatus.DISABLED
        ? 'Product disabled successfully'
        : body.status == ProductStatus.ACTIVE
          ? 'Product activated successfully'
          : 'Product set to pending successfully';

          return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: message,
            data: {},
          });
    }
}
