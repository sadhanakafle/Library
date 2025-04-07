import { ReservationType } from "@prisma/client"
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator"

export class CreateTransactionDto {

    @IsInt()
    @IsNotEmpty()
    user_id:number
    @IsInt()
    @IsNotEmpty()
    book_id:number
    @IsInt()
    @IsOptional()
    member_id:number
    @IsEnum(ReservationType)
    type:ReservationType
}
