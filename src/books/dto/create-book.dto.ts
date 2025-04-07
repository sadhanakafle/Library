import { IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean } from "class-validator"
export class CreateBookDto {

    @IsString()
    @IsNotEmpty()
    title:string;

    @IsString()
    @IsNotEmpty()
    author:string;

    @IsNotEmpty()
    @IsInt()
    quantity:number;

    @IsOptional()
    @IsBoolean()
    availability:boolean;
    
    @IsInt()
    user_id:number
}
