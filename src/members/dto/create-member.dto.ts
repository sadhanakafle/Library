import { IsString,IsEmail, IsNotEmpty, IsInt, IsNumber, IsOptional } from "class-validator"
export class CreateMemberDto {

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    mobile:string;

    @IsString()
    @IsNotEmpty()
    address:string;
    @IsOptional()
    @IsNumber()
    user_id:number;
}
