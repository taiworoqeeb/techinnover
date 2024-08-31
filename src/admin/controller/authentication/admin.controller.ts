import { AdminService } from '../../service/authentication/admin.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res, Next, HttpStatus, Put } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express'
import {  ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { logger } from '../../../util/logger';
import { AdminDto, AdminLoginDto } from '../../dto/admin.dto';
import { errorMessageHandler } from '../../../util/error';
import { Throttle } from '@nestjs/throttler';

@ApiTags("ADMIN AUTHENTICATION")
@Controller({path: 'admin', version: process.env.APP_VERSION})
export class AdminController {
  constructor(private readonly adminService: AdminService) {
  }

  @Throttle({ default: { limit: 1, ttl: 5000 } })
  @Post('register')
  @ApiBody({
    description: "Admin registration",
    type: AdminDto
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: "Admin registration is successful",
    example:{
      status: true,
      statusCode: HttpStatus.OK,
      message: "Account Created Successfully",
      data: {}
    }
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "An error occured when trying to register",
    example:{
      status: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: "Password does not match",
      data:{}
    }
  })
  async registerAccountController(@Body() body: AdminDto, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.adminService.registerAdminAccountService(body)
      return res.status(result.statusCode).json(result)
    } catch (error) {
       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: errorMessageHandler(error),
          data: {}
      })
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error);
    }
  }

  @Throttle({ default: { limit: 3, ttl: 10000 } })
  @Post('login')
  @ApiBody({
    description: "Admin login",
    type: AdminLoginDto
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: "Admin login is successful",
    example:{
      status: true,
      statusCode: HttpStatus.OK,
      message: "Successfully Logged In",
      data: {
        token: "string",
        adminId: "string",
        name: "string",
        email: "string",
        role: "admin"
      }
    }
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "An error occured when trying to register",
    example:{
      status: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: "The email and/or password are incorrect. Please try again",
      data:{}
    }
  })
  async loginAccountController(@Body() body: AdminLoginDto, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
    try {
      const result = await this.adminService.loginAdminAccountService(body)
      return res.status(result.statusCode).json(result)
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: errorMessageHandler(error),
          data: {}
      })
      logger.error(error.message, {statusCode: (error.status || HttpStatus.INTERNAL_SERVER_ERROR), route: req.originalUrl, method: req.method, error: error})
      next(error);
    }
  }
}
