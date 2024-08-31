import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../user/controller/user.controller';
import { UserService } from '../../../user/service/user.service';
import { Response, Request, NextFunction } from 'express';
import { Utils } from '../../../util';
import { closeInMongodConnection, rootMongooseTestModule } from '../../setup';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from '../../../user/entities/user.entity';
import { userDoc } from '../../mock/user.mock';
import { Model } from 'mongoose';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let mockUserModel: Model<UserDocument>

  const requestMock = (query:any, body: any) => {
    return {
      query: query,
      body: body
    } as unknown as Request;
  }

  const statusResponseMock = {
    json: jest.fn((x) => x)
  }

  const responseMock = {
      status: jest.fn((x) =>statusResponseMock),
      json: jest.fn((x) => x)
  } as unknown as Response

  const nextMock = {} as unknown as NextFunction

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports:[
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {name: User.name, schema: UserSchema},
        ]),
      ],
      controllers: [UserController],
      providers: [UserService, Utils],
    }).compile();

    mockUserModel = app.get<Model<UserDocument>>(getModelToken(User.name))


    await mockUserModel.insertMany([userDoc]);
    userController = app.get<UserController>(UserController);
    // userService = app.get<UserService>(UserService)
  });

  it('should be defined', () =>{
    expect(userController).toBeDefined();
  })

  describe('User Authentication', () => {

      it('should register user', async() => {

        const body = {
          "name": "John Doe",
          "email": "test123@gmail.com",
          "password": "password123",
          "confirm_password": "password123"
         }
        await userController.registerAccountController(body, requestMock(null, null), responseMock, nextMock);



        expect(responseMock.status).toHaveBeenCalledWith(200);
        expect(statusResponseMock.json).toHaveReturned()
      })

      it('should log user in', async() =>{
          const body = {
            "email": "test123@gmail.com",
            "password": "password123",
          }

          await userController.loginAccountController(body, requestMock(null, null), responseMock, nextMock);

          expect(responseMock.status).toHaveBeenCalledWith(200);
          expect(statusResponseMock.json).toHaveReturned()
      })

      it('should get user profile', async() =>{
        await userController.getProfileController(userDoc._id, requestMock(null, null), responseMock, nextMock);

        expect(responseMock.status).toHaveBeenCalledWith(200);
        expect(statusResponseMock.json).toHaveReturned()
      })

      it('should update user profile', async() =>{
        const body = {
          "name": "test new",

        }

        await userController.updateUserAccounController(body, userDoc._id, requestMock(null, null), responseMock, nextMock);

        expect(responseMock.status).toHaveBeenCalledWith(200);
        expect(statusResponseMock.json).toHaveBeenCalledWith({
          message: 'Profile updated successfully',
          status: true,
          statusCode: HttpStatus.OK,
          data: {}
        })
      })


      it('should change user password', async() =>{
        const body = {
          "oldPassword": "password123",
          "newPassword": "admin1234",
          "confirmPassword": "admin1234"
        }

        await userController.changeUserPassowrdController(body, userDoc._id, requestMock(null, null), responseMock, nextMock);

        expect(responseMock.status).toHaveBeenCalledWith(200);
        expect(statusResponseMock.json).toHaveBeenCalledWith({
          message: 'Password updated successfully',
          status: true,
          statusCode: HttpStatus.OK,
          data: {}
        })
      })

      it('should delete user account', async() =>{


        await userController.deleteAccountController(userDoc._id, requestMock(null, null), responseMock, nextMock);

        expect(responseMock.status).toHaveBeenCalledWith(200);
        expect(statusResponseMock.json).toHaveBeenCalledWith({
          status: true,
            statusCode: HttpStatus.OK,
            message: "Account deleted successfully",
            data:{}
        })
      })

  })

  afterAll(async () => {
    await closeInMongodConnection();
  });

});
