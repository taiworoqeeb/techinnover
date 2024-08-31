import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsEmail, MinLength} from 'class-validator';


export class UserDto{

    @ApiProperty({type: String, default: "John", description: "The User's Firstname"})
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({type: String, default: "johndoe@email.com", description: "The User's Email"})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({type: String, default: "password123"})
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string

    @ApiProperty({type: String, default: "password123"})
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    confirm_password: string

}

export class UserLoginDto{

    @ApiProperty({type: String, default: "johndoe@email.com"})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({type: String, default: "password123"})
    @IsString()
    @IsNotEmpty()
    password: string
}

export class UserParam{
    @ApiProperty({name: "userId", type: String, default: "sdksdsuihsfdddfd", description: "The User's Id"})
    @IsString()
    @IsNotEmpty()
    userId: string
}

export class UserUpdateDto{
    @ApiProperty({type: String, default: "John", description: "The User's Firstname"})
    @IsString()
    @IsNotEmpty()
    name?: string
}

export class UserPasswordUpdateDto{
    @ApiProperty({type: String, default: "password123"})
    oldPassword: string

    @ApiProperty({type: String, default: "password123"})
    newPassword: string

    @ApiProperty({type: String, default: "password123"})
    confirmPassword: string
}

export class UserPayload{
    user:{
        adminId?: string
        userId?: string
        id: string
        name: string
        email: string
        role: string
        status?: string
    }
}
