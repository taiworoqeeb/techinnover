import { HttpStatus, Injectable } from '@nestjs/common';
import { Admin, AdminDocument } from '../../entities/admin.entity';
import {
  queryConstructor,
  responseHandler,
  ResponseHandler,
  Utils,
} from 'src/util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AdminUpdateUserAccountStatusDTO,
  UserQueryDTO,
} from '../../dto/admin.dto';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { accountStatus } from 'src/enums/status.enum';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectModel(Admin.name)
    public adminModel: Model<AdminDocument>,
    @InjectModel(User.name)
    public userModel: Model<UserDocument>,
    public utils: Utils,
  ) {}

  async changeUserAccountStatusService(
    body: AdminUpdateUserAccountStatusDTO,
    userId: string,
  ): Promise<ResponseHandler> {
    let user = await this.userModel.findById(userId);

    if (!user) {
      return responseHandler({
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User account not found',
        data: {},
      });
    }

    user.status = body.accounStatus;
    await user.save();

    const message =
      body.accounStatus == accountStatus.BANNED
        ? 'User Account banned successfully'
        : body.accounStatus == accountStatus.ACTIVE
          ? 'User Account activated successfully'
          : 'User Account deleted successfully';

    return responseHandler({
      status: true,
      statusCode: HttpStatus.OK,
      message: message,
      data: {},
    });
  }

  async getUsersService(query: UserQueryDTO): Promise<ResponseHandler> {
    const { error, sort, params, limit, skip } = queryConstructor(
      query,
      'createdAt',
      'user',
    );
    if (error) {
      return responseHandler({
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: error,
        data: [],
      });
    }

    const user = await this.userModel
      .find({ ...params })
      .sort(sort)
      .limit(limit)
      .skip(skip);

    if (user.length == 0) {
      return responseHandler({
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'No user found',
        data: {
          totalUser: 0,
          user: [],
        },
      });
    }

    return responseHandler({
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: {
        totalUser: user.length,
        user: user,
      },
    });
  }
}
