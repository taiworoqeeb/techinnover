import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { accountStatus } from 'src/enums/status.enum';

export class UserQueryDTO {
  @ApiProperty({ type: String, description: "The User's ID", required: false })
  _id?: string;

  @ApiProperty({
    type: String,
    description: "The User's name",
    required: false,
  })
  name?: string;

  @ApiProperty({
    type: String,
    description: "The User's Email",
    required: false,
  })
  email?: string;

  @ApiProperty({
    type: String,
    enum: accountStatus,
    description: "The User's Status",
    required: false,
  })
  status?: accountStatus;
}

export class AdminDto {
  @ApiProperty({
    type: String,
    default: 'John Doe',
    description: "The Admin's name",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    default: 'admin@test.com',
    description: "The Admin's Email",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    default: 'password123',
    description: 'Admin password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    type: String,
    default: 'password123',
    description: 'Admin password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirm_password: string;
}

export class AdminLoginDto {
  @ApiProperty({
    type: String,
    default: 'admin@test.com',
    description: 'Admin Email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    default: 'password123',
    description: 'Admin password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AdminUpdateUserAccountStatusDTO {
  @ApiProperty({
    type: String,
    enum: accountStatus,
    default: accountStatus.ACTIVE,
    description: 'Change user account status',
  })
  @IsString()
  @IsNotEmpty()
  accounStatus: accountStatus;
}
