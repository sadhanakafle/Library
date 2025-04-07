import { IsNotEmpty,IsString,IsEmail, MinLength, MaxLength } from "class-validator"
export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @MinLength(7)
    @MaxLength(15)
    mobile: string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email:string;

    @IsNotEmpty()
    password: string;
  static id: number;
}
