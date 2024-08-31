import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Res, Next, HttpStatus, Put } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { NextFunction, Request, Response } from 'express'
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { logger } from '../../util/logger';
import { CustomRequest } from '../entities/user.entity';
import { UserDto, UserLoginDto, UserParam, UserPasswordUpdateDto, UserUpdateDto } from '../dto/user.dto';
import { errorMessageHandler } from '../../util/error';
import { Roles } from 'src/enums/role.decorator';
import { accountRole } from 'src/enums/role.enum';
import { Throttle } from '@nestjs/throttler';


@ApiTags("USER AUTHENTICATION")
@Controller({
  path: "user",
  version: process.env.APP_VERSION as string
})
export class UserController {
  constructor(
    private readonly userService: UserService
    ) {}

    @Throttle({ default: { limit: 1, ttl: 5000 } })
    @Post('register')
    @ApiBody({
      description: "User registration",
      type: UserDto
    })
    @ApiOkResponse({
      status: HttpStatus.OK,
      description: "User registration is successful",
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
    async registerAccountController(@Body() body: UserDto, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
      try {
        const result = await this.userService.registerUserAccountService(body)
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
      description: "User login",
      type: UserLoginDto
    })
    @ApiOkResponse({
      status: HttpStatus.OK,
      description: "User login is successful",
      example:{
        status: true,
        statusCode: HttpStatus.OK,
        message: "Successfully Logged In",
        data: {
          token: "string",
          userId: "string",
          name: "string",
          email: "string",
          role: "user",
          status: "active"
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
    async loginAccountController(@Body() body: UserLoginDto, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
      try {
        const result = await this.userService.loginUserAccountService(body)
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

    @Get(":userId/profile")
    @UseGuards(AuthGuard("jwt"))
    @Roles(accountRole.USER)
    @ApiBearerAuth('Authorization')
    @ApiOkResponse({
      status: HttpStatus.OK,
      description: "User profile fetched successfully",
      example:{
        status: true,
        statusCode: HttpStatus.OK,
        message: "User profile fetched successfully",
        data: {
          _id: "string",
          name: "string",
          email: "string",
          role: "user",
          status: "active"
        }
      }
    })
    @ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: "An error occured when trying to fetch user profile",
      example:{
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: "User does not exist",
        data:{}
      }
    })
    async getProfileController(@Param("userId") userId:string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
      try {
          const result = await this.userService.getProfileService(userId)
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

    @Throttle({ default: { limit: 1, ttl: 5000 } })
    @Put(":userId/update-account")
    @UseGuards(AuthGuard("jwt"))
    @ApiBearerAuth('Authorization')
    @Roles(accountRole.USER)
    @ApiBody({
      description: "Update user account",
      type: UserUpdateDto
    })
    @ApiOkResponse({
      status: HttpStatus.OK,
      description: "Profile updated successfully",
      example:{
        status: true,
        statusCode: HttpStatus.OK,
        message: "Profile updated successfully",
        data: {}
      }
    })
    @ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: "An error occured when trying to update user profile",
      example:{
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Profile could not be updated",
        data:{}
      }
    })
    async updateUserAccounController(@Body() body: UserUpdateDto, @Param("userId") userId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
      try {
        const result = await this.userService.updateProfileService(userId, body)
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

    @Put(":userId/change-password")
    @UseGuards(AuthGuard("jwt"))
    @ApiBearerAuth('Authorization')
    @Roles(accountRole.USER)
    @ApiBody({
      description: "Change password",
      type: UserPasswordUpdateDto
    })
    @ApiOkResponse({
      status: HttpStatus.OK,
      description: "Password updated successfully",
      example:{
        status: true,
        statusCode: HttpStatus.OK,
        message: "Password updated successfully",
        data: {}
      }
    })
    @ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: "An error occured when trying to change user password",
      example:{
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Old password is incorrect",
        data:{}
      }
    })
    async changeUserPassowrdController(@Body() body: UserPasswordUpdateDto, @Param("userId") userId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
      try {
        const result = await this.userService.changePasswordService(body, userId)
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

    @Throttle({ default: { limit: 1, ttl: 5000 } })
    @Delete(":userId/delete-account")
    @UseGuards(AuthGuard("jwt"))
    @ApiBearerAuth('Authorization')
    @Roles(accountRole.USER)
    @ApiOkResponse({
      status: HttpStatus.OK,
      description: "Account deleted successfully",
      example:{
        status: true,
        statusCode: HttpStatus.OK,
        message: "Account deleted successfully",
        data: {}
      }
    })
    @ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: "An error occured when trying to delete user account",
      example:{
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Your account is not active",
        data:{}
      }
    })
    async deleteAccountController(@Param("userId") userId: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction){
      try {
        const result = await this.userService.deleteUserAccountService(userId)
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
