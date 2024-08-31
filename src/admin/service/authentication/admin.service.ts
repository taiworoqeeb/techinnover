import { HttpStatus, Injectable } from '@nestjs/common';
import { Admin, AdminDocument } from '../../entities/admin.entity';
import { responseHandler, ResponseHandler, Utils } from 'src/util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminDto, AdminLoginDto } from '../../dto/admin.dto';
import * as bcrypt from "bcryptjs";


@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin.name)
        public adminModel: Model<AdminDocument>,
        public utils: Utils
    ){}

    async registerAdminAccountService(body: AdminDto):Promise<ResponseHandler> {

        const { name, email, password, confirm_password } = body;
        let admin = await this.adminModel.findOne({email})

        if(admin){
            return responseHandler({
                status: false,
                message: "Admin Already Exist, Please Log-In!",
                statusCode: HttpStatus.BAD_REQUEST,
                data: {}
            })

        }

        if(password !== confirm_password){
            return responseHandler({
                status: false,
                message: "Password does not match",
                statusCode: HttpStatus.BAD_REQUEST,
                data: {}
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        admin = new this.adminModel({
            name,
            email,
            password: hashedPass,
        })

        await admin.save();

        return responseHandler({
            status: true,
            message: "Account Created Successfully",
            data: {},
            statusCode: HttpStatus.OK
        })
    }

    async loginAdminAccountService(data: AdminLoginDto):Promise<ResponseHandler>{
        const { email, password} = data;

        let admin = await this.adminModel.findOne({email: email.toLowerCase()}).select("+password")
        if(!admin){
            return responseHandler({
                status: false,
                message: "The email and/or password are incorrect. Please try again",
                statusCode: HttpStatus.BAD_REQUEST,
                data: {}
            })
        }

        if(password === "" || password === null){
            return responseHandler({
                status: false,
                message: "Password is required",
                statusCode: HttpStatus.BAD_REQUEST,
                data: {}
            })
        }
        const validate = await bcrypt.compare(password, admin.password);
        if(validate){
            const token = await this.utils.tokenHandler({...admin._doc});
            return responseHandler({
                status: true,
                message: "Successfully Logged In",
                data: token,
                statusCode: HttpStatus.OK,
            })


        } else{

            return responseHandler({
                status: false,
                message: "The email and/or password are incorrect. Please try again",
                statusCode: HttpStatus.BAD_REQUEST,
                data: {}
            })
        }
    }

}
