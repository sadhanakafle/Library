import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaClient){}
  async create(createMemberDto: CreateMemberDto) {
    let member=await this.prisma.member.findUnique({
       where:{email:createMemberDto.email

       },
      });
       if (member) {
        throw new BadRequestException('This email is already registered');
      }

      member= await this.prisma.member.findUnique({
        where: {
          mobile: createMemberDto.mobile,
        }
      })
      if (member) {
        throw new BadRequestException('this mobile is already register');
      }
    
    return this.prisma.member.create({
      data:createMemberDto,
    });
  }

  findAll(user_id:number) {
    return this.prisma.member.findMany({
      where:{
        user_id,
      },
    });
  }

  async findOne(id: number, user_id:number) {
   const data=await this.prisma.member.findUnique({
    where:{id,user_id},
   });
    if(!data){
    throw new NotFoundException("member is not found")
  }
   return data;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    let member: Member |null;
    await this.findOne(id,updateMemberDto.user_id as number);

    if(updateMemberDto.email){
      member = await this.prisma.member.findUnique({
        where: {
          email:updateMemberDto.email,
        }
      });
      if(member && member.id!==id){
        throw new BadRequestException("This email is already registered")
      }
    }

    if(updateMemberDto.mobile){
      member = await this.prisma.member.findUnique({
        where: {
          mobile:updateMemberDto.mobile,
        }
      });
      if(member && member.id!==id){
        throw new BadRequestException("This mobile is already registered")
      }
    }
    return this.prisma.member.update({
      where: {id},
      data: updateMemberDto,
    });
  }

  async remove(id: number, user_id:number) {
    await this.findOne(id,user_id);
    return this.prisma.member.delete({
      where: {id},
    });
   }
}

