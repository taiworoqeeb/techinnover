import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Res, Next, HttpStatus, Put } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express'
import {  ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { logger } from '../../../util/logger';
import { errorMessageHandler } from '../../../util/error';
import { ProductService } from '../../service/product/product.service';

@ApiTags("PRODUCT SERVICE")
@Controller({path: 'product', version: process.env.APP_VERSION})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('get-active-products')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Product fetched successfully',
    example: {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Active products fetched successfully',
      data: [
        {
          _id: "string",
          name: "string",
          description: "string",
          price: "number",
          quantity: "number",
          status: "string"
        }
      ],
    },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'An error occured when trying to fetch product',
    example: {
      status: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'No products found',
      data: {},
    },
  })
  async getProductsController(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
){
    try {
        const result = await this.productService.fetchActiveProductsService()
        return res.status(result.statusCode).json(result)
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: errorMessageHandler(error),
            data: {},
          });
          logger.error(error.message, {
            statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            route: req.originalUrl,
            method: req.method,
            error: error,
          });
          next(error);
    }
}
}
