import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../../product/controller/product/product.controller';
import { ProductService } from '../../../product/service/product/product.service';
import { closeInMongodConnection, rootMongooseTestModule } from 'src/test/setup';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from 'src/user/entities/user.entity';
import { Admin, AdminSchema } from 'src/admin/entities/admin.entity';
import { Product, ProductDocument, ProductSchema } from 'src/product/entities/product.entity';
import { AdminProductController } from 'src/product/controller/admin/admin.controller';
import { UserProductController } from 'src/product/controller/user/user.controller';
import { UserProductService } from 'src/product/service/user/user.service';
import { AdminProductService } from 'src/product/service/admin/admin.service';
import { Response, Request, NextFunction } from 'express';
import { Model } from 'mongoose';
import { userDoc, userDoc2 } from 'src/test/mock/user.mock';
import { productDoc } from 'src/test/mock/product.mock';
import { ChangeProductStatusDTO, ProductCreateDTO, ProductQueryDTO } from 'src/product/dto/product.dto';
import { ProductStatus } from 'src/enums/product.enum';


describe('ProductController', () => {
  let controller: ProductController;
  let userController: UserProductController;
  let adminController: AdminProductController;
  let mockUserModel: Model<UserDocument>
  let mockProductModel: Model<ProductDocument>;

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
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }, {name: User.name, schema: UserSchema}, {name: Product.name, schema: ProductSchema}]),
      ],
      controllers: [ProductController, AdminProductController, UserProductController],
      providers: [ProductService, UserProductService, AdminProductService],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    userController = module.get<UserProductController>(UserProductController);
    adminController =module.get<AdminProductController>(AdminProductController);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name))
    mockProductModel = module.get<Model<ProductDocument>>(getModelToken(Product.name))
  });

  it('controllers should be defined', () => {
    expect(controller).toBeDefined();
    expect(userController).toBeDefined();
    expect(adminController).toBeDefined();
  });

  describe("User Product controller", ()=>{
    beforeAll(async()=>{
      await mockUserModel.insertMany([userDoc, userDoc2])
      await mockProductModel.insertMany([productDoc])
    })

    it('should create a product', async() =>{

      const body: ProductCreateDTO ={
          name: "Mango",
          description: "Yellow mango",
          price: 1500,
          quantity: 100,
      }

      await userController.addProductController(userDoc._id, body, requestMock(null, null), responseMock, nextMock)

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(statusResponseMock.json).toHaveReturned()

    })

    it('should fetch user\'s products', async() =>{

      await userController.getUserProductsController(userDoc._id, requestMock(null, null), responseMock, nextMock)

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(statusResponseMock.json).toHaveReturned()
    })

    it('should fetch a user\'s product', async() =>{

      await userController.getUserProductController(userDoc2._id, productDoc._id, requestMock(null, null), responseMock, nextMock)

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(statusResponseMock.json).toHaveReturned()
    })
  })

  describe("Admin Product controller", () =>{
    it("should change product status", async() =>{
          const body: ChangeProductStatusDTO ={
            status: ProductStatus.ACTIVE
        }

        await adminController.chnageProductStatusController(productDoc._id, body, requestMock(null, null), responseMock, nextMock)

        expect(responseMock.status).toHaveBeenCalledWith(200);
        expect(statusResponseMock.json).toHaveReturned()
    })

    it('should fetch products', async() =>{

      const query: ProductQueryDTO= {

      }

      await adminController.getProductsController(query, requestMock(null, null), responseMock, nextMock)

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(statusResponseMock.json).toHaveReturned()

    })

    it('should fetch a product', async() =>{

      await adminController.getProductByIdController(productDoc._id, requestMock(null, null), responseMock, nextMock)

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(statusResponseMock.json).toHaveReturned()

    })
  })

  describe("Product Controller", () =>{
    it("should show active product", async() =>{

      await controller.getProductsController(requestMock(null, null), responseMock, nextMock)

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(statusResponseMock.json).toHaveReturned()
    })
  })




  afterAll(async () => {
    await closeInMongodConnection();
  });
});
