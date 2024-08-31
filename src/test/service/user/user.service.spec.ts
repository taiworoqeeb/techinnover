import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../user/service/user.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema, UserInterface } from '../../../user/entities/user.entity';
import { Model } from 'mongoose';
import { Utils } from '../../../util';
import { userDoc } from '../../mock/user.mock';
import { HttpStatus } from '@nestjs/common';
import { closeInMongodConnection, rootMongooseTestModule } from '../../setup';
import { UserDto, UserLoginDto, UserPasswordUpdateDto } from '../../../user/dto/user.dto';
import { accountStatus } from 'src/enums/status.enum';


describe('UserService', () => {
  let service: UserService;
  let mockUserModel: Model<UserDocument>

  beforeAll(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports:[
        rootMongooseTestModule(),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema},
      ]),
      ],
      providers: [
        UserService,
        Utils,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name))


    await mockUserModel.insertMany([userDoc]);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User Authentication', () =>{
    it('should throw an error when trying to create when the password and confrim password don\'t match', async() =>{

      const body: UserDto = {
        "name": "John Doe",
        "email": "test@gmail.com",
        "password": "password123",
        "confirm_password": "password1234"
       }

       const {status, statusCode, message} = await service.registerUserAccountService(body)

       expect(statusCode).toEqual(HttpStatus.BAD_REQUEST)
       expect(status).toBeFalsy
       expect(message).toEqual("Password does not match")

     })

    it('should create a new user', async() =>{
        const body: UserDto = {
          "name": "John Doe",
          "email": "test@gmail.com",
          "password": "password123",
          "confirm_password": "password123"
        }

        const {status, statusCode, message} = await service.registerUserAccountService(body)

        expect(statusCode).toEqual(HttpStatus.OK)
        expect(status).toBeTruthy
        expect(message).toEqual("Account Created Successfully")
    })

    it('should throw an error when trying login with existing email', async() =>{

     const body: UserDto = {
        "name": "John Doe",
        "email": "test@gmail.com",
        "password": "password123",
        "confirm_password": "password123"
      }

      const {status, statusCode, message} = await service.registerUserAccountService(body)

      expect(statusCode).toEqual(HttpStatus.BAD_REQUEST)
      expect(status).toBeFalsy
      expect(message).toEqual("User Already Exist, Please Log-In!")

    })

    it('should get user profile', async() =>{
      const {status, statusCode, data} = await service.getProfileService(userDoc._id)

      expect(statusCode).toEqual(HttpStatus.OK)
      expect(status).toBeTruthy
      expect(data.name).toEqual(userDoc.name)
      expect(data.email).toEqual(userDoc.email)
    })

    it('should login user in', async () => {
      const body: UserLoginDto = {
        email: 'test@gmail.com',
        password: 'password123',
      };

      const { status, statusCode, message, data } =
        await service.loginUserAccountService(body);

      expect(statusCode).toEqual(HttpStatus.OK);
      expect(status).toBeTruthy;
      expect(message).toEqual('Successfully Logged In');
      expect(data).toHaveProperty('token');
    });

    it('should update user profile', async() =>{
      const body = {
        name: "taiwo raqeeb"
      }

      const {status, statusCode, data} = await service.updateProfileService(userDoc._id, body)
      const updatedUser = await mockUserModel.findById(userDoc._id)

      expect(statusCode).toEqual(HttpStatus.OK)
      expect(status).toBeTruthy
      expect(updatedUser.name).toEqual(body.name)
    })

    it('should change user password', async() =>{
        const body: UserPasswordUpdateDto = {
            oldPassword: "password123",
            newPassword: "d15597",
            confirmPassword: "d15597"
        }

        const {status, statusCode, message} = await service.changePasswordService(body, userDoc._id)

        expect(statusCode).toEqual(HttpStatus.OK)
        expect(status).toBeTruthy
        expect(message).toEqual("Password updated successfully")

    })

    it('should throw error, password incorrect', async() =>{
      const body: UserPasswordUpdateDto = {
          oldPassword: "password123",
          newPassword: "d15597",
          confirmPassword: "d15597"
      }

      const {status, statusCode, message} = await service.changePasswordService(body, userDoc._id)

      expect(statusCode).toEqual(HttpStatus.BAD_REQUEST)
      expect(status).toBeFalsy
      expect(message).toEqual("Old password is incorrect")
    })

    it('should soft delete account', async() =>{
        const {status, statusCode} = await service.deleteUserAccountService(userDoc._id)
        const deletedAccount = await mockUserModel.findById(userDoc._id)

        expect(statusCode).toEqual(HttpStatus.OK)
        expect(status).toBeTruthy
        expect(deletedAccount.status).toEqual(accountStatus.DELETED)
    })
  })





  afterAll(async () => {
    await closeInMongodConnection();
  });
});
