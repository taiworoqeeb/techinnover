import {config} from 'dotenv'
import {Injectable, PipeTransform,
    ArgumentMetadata, BadRequestException} from '@nestjs/common'
import * as jwt from "jsonwebtoken";
import {  User } from 'src/user/entities/user.entity'
import {Types } from 'mongoose'
import { Admin } from 'src/admin/entities/admin.entity';
import { UserTypePayload } from './type';
import { accountRole } from '../enums/role.enum';
config()

class ResponseHandler {
    status: boolean;
    statusCode: number;
    message: string;
    data: any;
    constructor(status: boolean, statusCode: number, message: string, data: any) {
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}

const responseHandler = (data: ResponseHandler) => {
  return {
      ...data
  }
}

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null
  }

  private trim(values: any) {
    Object.keys(values).forEach(key => {
      if (key !== 'password' && key !== 'confirm_password' && key !== 'confirmPassword' && key !== "newPassword") {
        if (this.isObj(values[key])) {
          values[key] = this.trim(values[key])
        } else {
          if (typeof values[key] === 'string') {
            values[key] = values[key].trim()
          }
        }
      }
    })
    return values
  }

  transform(values: any, metadata: ArgumentMetadata) {
    const { type } = metadata
    if (this.isObj(values) && type === 'body') {
      return this.trim(values)
    }else{
      return values
    }

    // throw new BadRequestException('Validation failed')
  }
}

  const queryConstructor = (query: any, sortBy:any, item:any) => {
    if (Object.values(query).includes("null")) {
      return { error: `Param value cannot be null` };
    }

    let params: any = {};
    let array: any = Object.keys(query);
    for (let i = 0; i < array.length; i++) {
      if (Object.keys(query)[i] === "id") {
        params["_id"] = new Types.ObjectId(String(Object.values(query)[i]));
      } else if (Object.keys(query)[i].endsWith("Id")) {
        params[Object.keys(query)[i]] = new Types.ObjectId(String(Object.values(query)[i]));
      } else {
        params[Object.keys(query)[i]] = Object.values(query)[i];
      }
    }

    let { limit, skip, sort } = params;
    limit = limit ? Number(limit) : 100;
    skip = skip ? Number(skip) : 0;

    if (sort === "asc" || sort === "desc") {
      if (typeof sortBy === "object") {
        let first = sortBy[Object.keys(sortBy)[0]];
        let second = sortBy[Object.keys(sortBy)[1]];

        sort = sort === "asc" ? { [first]: 1, [second]: 1 } : { [first]: -1, [second]: -1 };

      } else {
        sort = sort === "asc" ? { [sortBy]: 1 } : { [sortBy]: -1 };
      }
    } else if (sort == undefined) {
      sort = { [sortBy]: 1 };
    } else {
      return { error: `Unable to find ${item} might be because of invalid params` };
    }

    delete params.limit;
    delete params.skip;
    delete params.sort;
    return { params, limit, skip, sort };
  };

  @Injectable()
  class Utils {
  async tokenHandler( data: UserTypePayload){
    try {
      const { _id, name,  email, status, role  } = data

    let identification =  role == accountRole.USER ? "userId" : "adminId"

        const payload =  {
          user: {[identification]: _id, id: _id, name,  email, role, status}
         }
         const jwtOption = {expiresIn: '2d'}

        const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOption)
      return role == accountRole.USER ? { token: `Bearer ${token}`, [identification]: _id, name,  email, role, status} : { token: `Bearer ${token}`, [identification]: _id, name,  email, role}

    } catch (error) {
      throw new Error(`Unable to generate token. ${error.message}`);
    }
  };

}


export{
    responseHandler,
    Utils,
    ResponseHandler,
    queryConstructor
}
