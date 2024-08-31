import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Res, Next, HttpStatus, Put, Query } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express'
import {  ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { logger } from '../../../util/logger';
import { errorMessageHandler } from '../../../util/error';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/enums/role.decorator';
import { accountRole } from 'src/enums/role.enum';
import { AdminProductService } from 'src/product/service/admin/admin.service';
import { ChangeProductStatusDTO, ProductQueryDTO } from 'src/product/dto/product.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags("ADMIN-PRODUCT SERVICE")
@Controller({path: 'admin/:adminId/product', version: process.env.APP_VERSION})
@ApiParam({
    name: 'adminId',
    type: String,
})
export class AdminProductController {
    constructor(
        private readonly adminProductService: AdminProductService
    ){}

    @Get("get-all-products")
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('Authorization')
    @Roles(accountRole.ADMIN)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Product fetched successfully',
        example: {
          status: true,
          statusCode: HttpStatus.OK,
          message: 'Products fetched successfully',
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
        @Query() query: ProductQueryDTO,
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
    ){
        try {
            const result = await this.adminProductService.fetchProductsService(query)
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
    @Roles(accountRole.ADMIN)
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Product fetched successfully',
        example: {
          status: true,
          statusCode: HttpStatus.OK,
          message: 'Product fetched successfully',
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
          message: 'No product found',
          data: {},
        },
      })
    async getProductByIdController(
        @Param('productId') productId: string,
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
    ){
        try {
            const result = await this.adminProductService.fetchProductByIdService(productId)
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
    @Put(":productId/update-product-status")
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('Authorization')
    @Roles(accountRole.ADMIN)
    @ApiBody({
        description: 'Change product status',
        type: ChangeProductStatusDTO,
    })
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Product status changed successfully',
        example: {
          status: true,
          statusCode: HttpStatus.OK,
          message: 'Product activated successfully',
          data: {},
        },
      })
      @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'An error occured when trying to change product status',
        example: {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Unable to update product status',
          data: {},
        },
      })
    async chnageProductStatusController(
        @Param("productId") productId: string,
        @Body() body: ChangeProductStatusDTO,
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
    ){
        try {
            const result = await this.adminProductService.changeProductStatusService(productId, body)
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
