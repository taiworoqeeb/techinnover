import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../../product/service/product/product.service';
import { closeInMongodConnection, rootMongooseTestModule } from 'src/test/setup';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/admin/entities/admin.entity';
import { User, UserDocument, UserSchema } from 'src/user/entities/user.entity';
import { Product, ProductDocument, ProductSchema } from 'src/product/entities/product.entity';
import { UserProductService } from 'src/product/service/user/user.service';
import { AdminProductService } from 'src/product/service/admin/admin.service';
import { ChangeProductStatusDTO, ProductCreateDTO, ProductQueryDTO, ProductUpdateDTO } from 'src/product/dto/product.dto';
import { Model } from 'mongoose';
import { userDoc, userDoc2 } from 'src/test/mock/user.mock';
import { HttpStatus } from '@nestjs/common';
import { productDoc } from 'src/test/mock/product.mock';
import { ProductStatus } from 'src/enums/product.enum';

describe('Product', () => {
  let service: ProductService;
  let userService: UserProductService;
  let adminService: AdminProductService;
  let mockUserModel: Model<UserDocument>
  let mockProductModel: Model<ProductDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }, {name: User.name, schema: UserSchema}, {name: Product.name, schema: ProductSchema}]),
      ],
      providers: [ProductService, UserProductService, AdminProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    userService = module.get<UserProductService>(UserProductService);
    adminService = module.get<AdminProductService>(AdminProductService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name))
    mockProductModel = module.get<Model<ProductDocument>>(getModelToken(Product.name))


    await mockProductModel.deleteMany({})
    await mockUserModel.deleteMany({})
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(adminService).toBeDefined();
  });

  describe("User Product Service", () =>{
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

      const {status, statusCode, message} = await userService.createProductService(body, userDoc._id)

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK)
      expect(message).toEqual("Product created successfully")

    })

    it('should show an error of product already exists', async() =>{

      const body: ProductCreateDTO ={
          name: "Mango",
          description: "Yellow mango",
          price: 1500,
          quantity: 100,
      }

      const {status, statusCode, message} = await userService.createProductService(body, userDoc._id)

      expect(status).toBeFalsy;
      expect(statusCode).toEqual(HttpStatus.BAD_REQUEST)
      expect(message).toEqual("Product with this name already exists")

    })

    it('should fetch user\'s products', async() =>{

      const {status, statusCode, message, data} = await userService.fetchProductsService(userDoc._id)

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK)
      expect(message).toEqual("User products fetched successfully")
      expect(data.products).toHaveLength(1)
      expect(data.totalProduct).toEqual(1)

    })

    it('should fetch a user\'s product', async() =>{

      const {status, statusCode, message, data} = await userService.fetchProductByIdService(userDoc2._id, productDoc._id)

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK)
      expect(message).toEqual("User product fetched successfully")
      expect(data).toBeDefined()
      expect(data.name).toEqual(productDoc.name)

    })

    it('should update a product', async() =>{

      const body: ProductUpdateDTO={
        name: "orange"
      }

      const {status, statusCode, message} = await userService.updateProductService(productDoc._id, userDoc2._id, body )

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK)
      expect(message).toEqual("Product updated successfully")


    })

    it('should delete a product', async() =>{

      const {status, statusCode, message} = await userService.deleteProductService(productDoc._id, userDoc2._id )

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK)
      expect(message).toEqual("Product deleted successfully")


    })

  })

  describe("Admin product service", () =>{
    beforeAll(async()=>{
      // await mockUserModel.insertMany([userDoc, userDoc2])
      await mockProductModel.insertMany([productDoc])
    })

    it('should update a product status', async() =>{

      const body: ChangeProductStatusDTO={
        status: ProductStatus.DISABLED
      }

      const {status, statusCode, message} = await adminService.changeProductStatusService(productDoc._id, body )

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK)
      expect(message).toEqual("Product disabled successfully")


    })


    it('should fetch products', async() =>{

      const query: ProductQueryDTO= {

      }

      const {status, statusCode, message, data} = await adminService.fetchProductsService(query)

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK)
      expect(message).toEqual("Products fetched successfully")
      expect(data.products).toHaveLength(2)
      expect(data.totalProduct).toEqual(2)

    })

    it('should fetch pending products', async() =>{

      const query: ProductQueryDTO= {
        status: ProductStatus.PENDING
      }

      const {status, statusCode, message, data} = await adminService.fetchProductsService(query)

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK)
      expect(message).toEqual("Products fetched successfully")
      expect(data.products).toHaveLength(1)
      expect(data.totalProduct).toEqual(1)

    })

    it('should fetch active products', async() =>{

      await mockProductModel.updateMany({status: ProductStatus.PENDING}, {status: ProductStatus.ACTIVE})

      const query: ProductQueryDTO= {
        status: ProductStatus.ACTIVE
      }

      const {status, statusCode, message, data} = await adminService.fetchProductsService(query)

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK)
      expect(message).toEqual("Products fetched successfully")
      expect(data.products).toHaveLength(1)
      expect(data.totalProduct).toEqual(1)

    })

    it('should fetch a product', async() =>{

      const {status, statusCode, message, data} = await adminService.fetchProductByIdService(productDoc._id)

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK)
      expect(message).toEqual("Product fetched successfully")
      expect(data).toBeDefined()
      expect(data.name).toEqual(productDoc.name)

    })

  })

  describe("Product Service", ()=>{
    it("should show active product", async() =>{

      const {status, statusCode, message, data} = await service.fetchActiveProductsService()

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK)
      expect(message).toEqual("Active products fetched successfully")
      expect(data.products).toHaveLength(1)
      expect(data.totalProduct).toEqual(1)

    })
  })

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
