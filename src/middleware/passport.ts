import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { UserPayload } from "../user/dto/user.dto";
import * as dotenv from "dotenv";
import { User, UserDocument } from "../user/entities/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Request } from "express";
import { Model } from "mongoose";
import { accountRole } from "src/enums/role.enum";
import { Admin, AdminDocument } from "src/admin/entities/admin.entity";
dotenv.config();

@Injectable()
export class Passport extends PassportStrategy(Strategy){
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(Admin.name)
        private adminModel: Model<AdminDocument>
        ){
        super({
            secretOrKey: process.env.JWT_SECRET as string,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true
        });
    }
        async validate(req: Request, payload: UserPayload, done: VerifiedCallback): Promise<any>{

            // console.log(payload)

            let param: string;
            const type = payload.user.role
            const userId = type == accountRole.USER ? payload.user.userId : payload.user.adminId

            if(type == accountRole.USER){
                param = req.params.userId
            }else if(type == accountRole.ADMIN){
                param = req.params.adminId
            }else{
                return done("unauthorized", false)
            }

            if(userId !== param){
                return done("unauthorized", false)
            }

            if(payload.user.role == accountRole.USER){
                const user = await this.userModel.findById(payload.user.id);
                if(!user){
                    return done("unauthorized", false)
                }
                return done(null, user);
            }else if(payload.user.role == accountRole.ADMIN){
                const admin = await this.adminModel.findById(payload.user.id);
                if(!admin){
                    return done("unauthorized", false)
                }
                return done(null, admin);
            }else{
                return done("unauthorized", false)
            }

    }
}
