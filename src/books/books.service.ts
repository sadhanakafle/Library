import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaClient){}
  create(createBookDto: CreateBookDto,) {
    return this.prisma.book.create({
      data:createBookDto,
    });
  }

  findAll(user_id:number) {
    return this.prisma.book.findMany({
      where:{
        user_id,
      },
    });
  }

  async findOne(id: number,user_id:number) {
    const data=await this.prisma.book.findUnique({
      where:{id,user_id},
     });
      if(!data){
      throw new NotFoundException("book is not found")
    }
     return data;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id,updateBookDto.user_id as number);
    return this.prisma.book.update({
      where: {id},
      data: updateBookDto,
    });
  }

  async remove(id: number,user_id:number) {
    await this.findOne(id,user_id);
    return this.prisma.book.delete({
      where: {id},
    });
  }
}

 
