import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaClient){
  }
  async create(createUserDto: CreateUserDto) {
    let user= await this.prisma.user.findUnique({
      where:{
        email: createUserDto.email,
      },
    });
    if(user){
      throw new BadRequestException("This email is already registerd");
    }
     user= await this.prisma.user.findUnique({
        where:{
          mobile:createUserDto.mobile,
        },
     });
     if(user){
      throw new BadRequestException("This mobile is already registerd")
     }
     createUserDto.password = await hash(createUserDto.password, 10)
    return this.prisma.user.create({
      data: createUserDto,
    }) ;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user=await this.prisma.user.findUnique({
      where: {id},
    });
    if(!user){
      throw new NotFoundException("user is not found")
    }
    return user;
  }

 async update(id: number, updateUserDto: UpdateUserDto) {
    let user: User | null;
    await this.findOne(id);

    if (updateUserDto.email) {
      user = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (user && user.id !== id) {
        throw new BadRequestException('this email is already registered');
      }
  }

  if (updateUserDto.mobile) { // check if mobile field is present in the updateuserdto
    user = await this.prisma.user.findUnique({
      where: { mobile: updateUserDto.mobile },
    });

    if (user && user.id !== id) {
      throw new BadRequestException('this mobile is already registered');
    }
  }
  return this.prisma.user.update({
    where: {id},
    data: updateUserDto,
  });
}

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: {id},
    });
  }
}
