import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private readonly prisma:PrismaClient,
        private readonly usersService:UsersService,
        private readonly jwtService:JwtService
){}
async register (registerDto:RegisterDto){
const user = await this.usersService.create(registerDto)
const token=await this.jwtService.signAsync(user)// const token=await this.jwtService.signAsync(user.id,user.email)
return {token};
}


async login(loginDto:LoginDto){
const user= await this.prisma.user.findFirst({
where:{
    OR:[
      {
        email:loginDto.username
      },
      {
        mobile:loginDto.username
      },
    ],

},
});

if(!user){
throw new NotFoundException("unable to find the user")
}

const ispasswordvalid = await compare(loginDto.password, user.password)
if(!ispasswordvalid){
throw new UnauthorizedException("Invalid credential")
}
const token =await this.jwtService.signAsync(user);
return {token}
}}

