import {
  Controller,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  Res,
  Next,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { logger } from '../../../util/logger';
import {

  AdminUpdateUserAccountStatusDTO,
  UserQueryDTO,
} from '../../dto/admin.dto';
import { errorMessageHandler } from '../../../util/error';
import { AdminUserService } from 'src/admin/service/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { accountRole } from 'src/enums/role.enum';
import { Roles } from 'src/enums/role.decorator';
import { Throttle } from '@nestjs/throttler';


@ApiTags('ADMIN-USER SERVICE')
@Controller({ path: 'admin/:adminId', version: process.env.APP_VERSION })
@ApiParam({
  name: 'adminId',
  type: String,
})
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Throttle({ default: { limit: 1, ttl: 5000 } })
  @Put('user/:userId/change-user-account-status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('Authorization')
  @Roles(accountRole.ADMIN)
  @ApiParam({
    name: 'userId',
    type: String,
  })
  @ApiBody({
    description: 'Admin change user account status',
    type: AdminUpdateUserAccountStatusDTO,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Admin change user account status successfully',
    example: {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'User Account banned successfully',
      data: {},
    },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'An error occured when trying to change user account status',
    example: {
      status: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'User account not found',
      data: {},
    },
  })
  async changeUserAccountStatusController(
    @Param('userId') userId: string,
    @Body() body: AdminUpdateUserAccountStatusDTO,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.adminUserService.changeUserAccountStatusService(
        body,
        userId,
      );
      return res.status(result.statusCode).json(result);
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

  @Get('user/get-all-users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('Authorization')
  @Roles(accountRole.ADMIN)
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Admin fetch users by query successfully',
    example: {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: {
        totalUser: 'number',
        user: [
          {
            _id: "string",
            name: "string",
            email: "string",
            status: "string"
          }
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'An error occured when trying to change user account status',
    example: {
      status: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'No user found',
      data: {
        totalUser: 0,
        user: 'array',
      },
    },
  })
  async getUsersController(
    @Query() query: UserQueryDTO,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const result = await this.adminUserService.getUsersService(query);
      return res.status(result.statusCode).json(result);
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
