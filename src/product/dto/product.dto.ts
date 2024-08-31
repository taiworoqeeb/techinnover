import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength, IsNumber } from 'class-validator';
import { ProductStatus } from 'src/enums/product.enum';

export class ProductCreateDTO{
    @ApiProperty({
        type: String,
        default: 'Mongo',
        description: "The Product's name",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: String,
        default: 'Mongo is sweet',
        description: "The Product's description",
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        type: Number,
        default: 10,
        description: "The Product's price",
    })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({
        type: Number,
        default: 10,
        description: "The Product's quantity",
    })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class ProductUpdateDTO{
    @ApiProperty({
        type: String,
        default: 'Mongo',
        description: "The Product's name",
        required: false
    })
    name?: string;

    @ApiProperty({
        type: String,
        default: 'Mongo is sweet',
        description: "The Product's description",
        required: false
    })
    description?: string;

    @ApiProperty({
        type: Number,
        default: 10,
        description: "The Product's price",
        required: false
    })
    price?: number;

    @ApiProperty({
        type: Number,
        default: 10,
        description: "The Product's quantity",
        required: false
    })
    quantity?: number;
}

export class ProductQueryDTO{
    @ApiProperty({ type: String, description: "The Product's ID", required: false })
    _id?: string;

    @ApiProperty({ type: String, description: "The User's ID", required: false })
    userId?: string;

    @ApiProperty({
        type: String,
        description: "The Product's name",
        required: false
    })
    name?: string;

    @ApiProperty({
        type: String,
        description: "The Product's description",
        required: false
    })
    description?: string;

    @ApiProperty({
        type: Number,
        description: "The Product's price",
        required: false
    })
    price?: number;

    @ApiProperty({
        type: Number,
        description: "The Product's quantity",
        required: false
    })
    quantity?: number;

    @ApiProperty({
        type: String,
        description: "The Product's status",
        enum: ProductStatus,
        required: false
    })
    status?: ProductStatus;
}

export class ChangeProductStatusDTO{
    @ApiProperty({
        type: String,
        description: "The Product's status",
        enum: ProductStatus,
        required: true
    })
    @IsString()
    @IsNotEmpty()
    status: ProductStatus;
}
