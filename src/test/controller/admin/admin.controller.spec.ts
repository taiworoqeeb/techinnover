import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../../../admin/controller/authentication/admin.controller';
import { AdminService } from '../../../admin/service/authentication/admin.service';
import { closeInMongodConnection, rootMongooseTestModule } from 'src/test/setup';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/admin/entities/admin.entity';
import { User, UserDocument, UserSchema } from 'src/user/entities/user.entity';
import { AdminUserService } from 'src/admin/service/user/user.service';
import { Utils } from 'src/util';
import { AdminUserController } from 'src/admin/controller/user/user.controller';
import { Response, Request, NextFunction } from 'express';
import { Model } from 'mongoose';
import { userDoc, userDoc2 } from 'src/test/mock/user.mock';
import { AdminUpdateUserAccountStatusDTO, UserQueryDTO } from 'src/admin/dto/admin.dto';
import { accountStatus } from 'src/enums/status.enum';

describe('AdminController', () => {
  let controller: AdminController;
  let userController: AdminUserController
  let mockUserModel: Model<UserDocument>


  const requestMock = (query:any, body: any) => {
    return {
      query: query,
      body: body
    } as unknown as Request;
  }

  // const jsonDataMock = {
  //   status: jest.fn((x) => x),
  //   statusCode: jest.fn((x) => x),
  //   message: jest.fn((x) => x),
  //   data: jest.fn((x) => x)
  // }

  const statusResponseMock = {
    json: jest.fn((x) => x)
  }

  const responseMock = {
      status: jest.fn((x) =>statusResponseMock),
      json: jest.fn((x) => x)
  } as unknown as Response

  const nextMock = {} as unknown as NextFunction

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }, {name: User.name, schema: UserSchema}]),
      ],
      controllers: [AdminController, AdminUserController],
      providers: [AdminService, AdminUserService, Utils],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    userController = module.get<AdminUserController>(AdminUserController);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name))

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userController).toBeDefined();
  });

  describe('Admin Authentication', () =>{
    it('should register user', async() => {

      const body = {
        "name": "John Doe",
        "email": "test123@gmail.com",
        "password": "password123",
        "confirm_password": "password123"
       }
      await controller.registerAccountController(body, requestMock(null, null), responseMock, nextMock);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(statusResponseMock.json).toHaveReturned()
    })

    it('should log user in', async() =>{
      const body = {
        "email": "test123@gmail.com",
        "password": "password123",
      }

      await controller.loginAccountController(body, requestMock(null, null), responseMock, nextMock);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(statusResponseMock.json).toHaveReturned()
    })

  })

    describe("User-Admin Controller", ()=>{
      beforeAll(async() =>{
        await mockUserModel.create([userDoc, userDoc2])
      })

      it('should change user status', async() =>{
        const body: AdminUpdateUserAccountStatusDTO ={
            accounStatus: accountStatus.BANNED
        }

        await userController.changeUserAccountStatusController(userDoc._id, body, requestMock(null, null), responseMock, nextMock)

        expect(responseMock.status).toHaveBeenCalledWith(200);
        expect(statusResponseMock.json).toHaveReturned()

      })

      it('should fetch all users', async() =>{
        const query: UserQueryDTO  ={}

        await userController.getUsersController(query, requestMock(null, null), responseMock, nextMock)

        expect(responseMock.status).toHaveBeenCalledWith(200);
        expect(statusResponseMock.json).toHaveReturned()



      })

      it('should fetch all users', async() =>{
        const query: UserQueryDTO  ={
          status: accountStatus.ACTIVE
        }

        await userController.getUsersController(query, requestMock(null, null), responseMock, nextMock)

        expect(responseMock.status).toHaveBeenCalledWith(200);
        expect(statusResponseMock.json).toHaveReturned()


      })

    })

    afterAll(async () => {
      await closeInMongodConnection();
    });
});
