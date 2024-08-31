import { Get, Res, Next, Controller, HttpStatus } from '@nestjs/common';
import { ApiBadGatewayResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {Response, NextFunction } from 'express';

@ApiTags('API Healths')
@Controller('health')
export class AppController{
    @Get('/')
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: "API is live in development",
        example:{
            status: true,
          statusCode: HttpStatus.OK,
          message: 'API is live and healthy in sandbox mode',
          data: {},
        }
    })
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: "API is live in production",
        example:{
            status: true,
            statusCode: HttpStatus.OK,
            message: 'API is live and healthy',
            data: {},
        }
    })
    @ApiBadGatewayResponse({
        status: HttpStatus.BAD_GATEWAY,
        description: "Unable to reach app API",
        example:{
            status: false,
            statusCode: HttpStatus.BAD_GATEWAY,
            message: 'Unable to reach app API',
            data: {},
        }
    })
    getHealth(@Res() res: Response, @Next() next: NextFunction){
        const message = process.env.NODE_ENV == "production"
        ? "API is live and healthy"
        : "API is live and healthy in sandbox mode"

        res.status(HttpStatus.OK).json({status: true, statusCode: HttpStatus.OK, message, data:{}})
    }
}
