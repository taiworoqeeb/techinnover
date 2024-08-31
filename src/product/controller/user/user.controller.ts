import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Res, Next, HttpStatus, Put } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express'
import {  ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { logger } from '../../../util/logger';
import { errorMessageHandler } from '../../../util/error';
import { UserProductService } from 'src/product/service/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/enums/role.decorator';
import { accountRole } from 'src/enums/role.enum';
import { ProductCreateDTO, ProductUpdateDTO } from 'src/product/dto/product.dto';
import { Throttle } from '@nestjs/throttler';


@ApiTags("USER-PRODUCT SERVICE")
@Controller({path: 'user/:userId/product', version: process.env.APP_VERSION})
export class UserProductController {
    constructor(
        private readonly userProductService: UserProductService
    ){}

    @Throttle({ default: { limit: 1, ttl: 5000 } })
    @Post("add-product")
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('Authorization')
    @Roles(accountRole.USER)
    @ApiBody({
        description: 'Add Product',
        type: ProductCreateDTO,
    })
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Product added successfully',
        example: {
          status: true,
          statusCode: HttpStatus.OK,
          message: 'Product created successfully',
          data: {},
        },
      })
      @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'An error occured when trying to add product',
        example: {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Product with this name already exists',
          data: {},
        },
      })
    async addProductController(
        @Param('userId') userId: string,
        @Body() body: ProductCreateDTO,
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
    ){
        try {
            const result = await this.userProductService.createProductService(body, userId)
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

    @Throttle({ default: { limit: 1, ttl: 5000 } })
    @Put(":productId/update-product")
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('Authorization')
    @Roles(accountRole.USER)
    @ApiBody({
        description: 'update Product',
        type: ProductUpdateDTO,
    })
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Product updated successfully',
        example: {
          status: true,
          statusCode: HttpStatus.OK,
          message: 'Product updated successfully',
          data: {},
        },
      })
      @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'An error occured when trying to update product',
        example: {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Unable to update product',
          data: {},
        },
      })
    async updateProductController(
        @Param('userId') userId: string,
        @Param("productId") productId: string,
        @Body() body: ProductUpdateDTO,
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
    ){
        try {
            const result = await this.userProductService.updateProductService(productId, userId, body)
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

    @Get("get-all-products")
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('Authorization')
    @Roles(accountRole.USER)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Product fetched successfully',
        example: {
          status: true,
          statusCode: HttpStatus.OK,
          message: 'User products fetched successfully',
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
    async getUserProductsController(
        @Param('userId') userId: string,
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
    ){
        try {
            const result = await this.userProductService.fetchProductsService(userId)
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

    @Get(":productId/get-product")
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('Authorization')
    @Roles(accountRole.USER)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Product fetched successfully',
        example: {
          status: true,
          statusCode: HttpStatus.OK,
          message: 'User product fetched successfully',
          data: {
            _id: "string",
            name: "string",
            description: "string",
            price: "number",
            quantity: "number",
            status: "string"
          },
        },
      })
      @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'An error occured when trying to fetch product',
        example: {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Product not found',
          data: {},
        },
      })
    async getUserProductController(
        @Param('userId') userId: string,
        @Param('productId') productId: string,
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
    ){
        try {
            const result = await this.userProductService.fetchProductByIdService(userId, productId)
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

    @Throttle({ default: { limit: 1, ttl: 5000 } })
    @Delete(":productId/delete-product")
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('Authorization')
    @Roles(accountRole.USER)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Product deleted successfully',
        example: {
          status: true,
          statusCode: HttpStatus.OK,
          message: 'Product deleted successfully',
          data: {},
        },
      })
      @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'An error occured when trying to update product',
        example: {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Unable to delete product',
          data: {},
        },
      })
    async deleteProductController(
        @Param('userId') userId: string,
        @Param("productId") productId: string,
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
    ){
        try {
            const result = await this.userProductService.deleteProductService(productId, userId)
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
