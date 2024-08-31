import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '../../../admin/service/authentication/admin.service';
import {
  Admin,
  AdminDocument,
  AdminSchema,
} from 'src/admin/entities/admin.entity';
import { Model } from 'mongoose';
import { closeInMongodConnection, rootMongooseTestModule } from 'src/test/setup';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Utils } from 'src/util';
import { HttpStatus } from '@nestjs/common';
import { AdminDto, AdminLoginDto, AdminUpdateUserAccountStatusDTO, UserQueryDTO } from 'src/admin/dto/admin.dto';
import { AdminUserService } from 'src/admin/service/user/user.service';
import { User, UserDocument, UserSchema } from 'src/user/entities/user.entity';
import { userDoc, userDoc2 } from 'src/test/mock/user.mock';
import { accountStatus } from 'src/enums/status.enum';

describe('AdminService', () => {
  let service: AdminService;
  let userService: AdminUserService
  let mockUserModel: Model<UserDocument>
  // let mockAdminModel: Model<AdminDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }, {name: User.name, schema: UserSchema}]),
      ],
      providers: [AdminService, AdminUserService, Utils],
    }).compile();

    service = module.get<AdminService>(AdminService);
    userService = module.get<AdminUserService>(AdminUserService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name))
    // mockAdminModel = module.get<Model<AdminDocument>>(
    //   getModelToken(Admin.name),
    // );

    await mockUserModel.deleteMany({})
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Admin Authentication', () => {
    it("should throw an error when trying to create when the password and confrim password don't match", async () => {
      const body: AdminDto = {
        name: 'John Doe',
        email: 'test@gmail.com',
        password: 'password123',
        confirm_password: 'password1234',
      };

      const { status, statusCode, message } =
        await service.registerAdminAccountService(body);

      expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(status).toBeFalsy;
      expect(message).toEqual('Password does not match');
    });

    it('should create a new user', async () => {
      const body: AdminDto = {
        name: 'John Doe',
        email: 'test@gmail.com',
        password: 'password123',
        confirm_password: 'password123',
      };

      const { status, statusCode, message } =
        await service.registerAdminAccountService(body);

      expect(statusCode).toEqual(HttpStatus.OK);
      expect(status).toBeTruthy;
      expect(message).toEqual('Account Created Successfully');
    });

    it('should throw an error when trying register with existing email', async () => {
      const body: AdminDto = {
        name: 'John Doe',
        email: 'test@gmail.com',
        password: 'password123',
        confirm_password: 'password123',
      };

      const { status, statusCode, message } =
        await service.registerAdminAccountService(body);

      expect(statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(status).toBeFalsy;
      expect(message).toEqual('Admin Already Exist, Please Log-In!');
    });

    it('should login user in', async () => {
      const body: AdminLoginDto = {
        email: 'test@gmail.com',
        password: 'password123',
      };

      const { status, statusCode, message, data } =
        await service.loginAdminAccountService(body);

      expect(statusCode).toEqual(HttpStatus.OK);
      expect(status).toBeTruthy;
      expect(message).toEqual('Successfully Logged In');
      expect(data).toHaveProperty('token');
    });

    it('should login user in', async () => {
      const body: AdminLoginDto = {
        email: 'test@gmail.com',
        password: 'password123',
      };

      const { status, statusCode, message, data } =
        await service.loginAdminAccountService(body);

      expect(statusCode).toEqual(HttpStatus.OK);
      expect(status).toBeTruthy;
      expect(message).toEqual('Successfully Logged In');
      expect(data).toHaveProperty('token');
    });
  });

  describe('Admin-User Service', () => {
      beforeAll(async() =>{
        await mockUserModel.create([userDoc, userDoc2])
      })

      it("should fetch all user", async() =>{
        const query: UserQueryDTO ={}

        const { status, statusCode, message, data } =
        await userService.getUsersService(query);

        expect(status).toBeTruthy();
        expect(statusCode).toEqual(HttpStatus.OK);
        expect(message).toEqual('Users fetched successfully')
        expect(data).toHaveProperty("totalUser")
        expect(data).toHaveProperty("user")
        expect(data.user).toHaveLength(2)

      })

      it("should fetch a user", async() =>{
        const query: UserQueryDTO ={
          _id: userDoc._id
        }

        const { status, statusCode, message, data } =
        await userService.getUsersService(query);

        expect(status).toBeTruthy();
        expect(statusCode).toEqual(HttpStatus.OK);
        expect(message).toEqual('Users fetched successfully')
        expect(data).toHaveProperty("totalUser")
        expect(data).toHaveProperty("user")
        expect(data.user).toHaveLength(1)

      })

      it("should fetch all active user", async() =>{
        const query: UserQueryDTO ={
          status: accountStatus.ACTIVE
        }

        const { status, statusCode, message, data } =
        await userService.getUsersService(query);

        expect(status).toBeTruthy();
        expect(statusCode).toEqual(HttpStatus.OK);
        expect(message).toEqual('Users fetched successfully')
        expect(data).toHaveProperty("totalUser")
        expect(data).toHaveProperty("user")
        expect(data.user).toHaveLength(2)

      })

      it("should ban user status", async() =>{
        const body: AdminUpdateUserAccountStatusDTO ={
         accounStatus: accountStatus.BANNED
        }

        const { status, statusCode, message } =
        await userService.changeUserAccountStatusService(body, userDoc._id);

        expect(status).toBeTruthy();
        expect(statusCode).toEqual(HttpStatus.OK);
        expect(message).toEqual('User Account banned successfully')


      })
  })
  afterAll(async () => {
    await closeInMongodConnection();
  });
});
