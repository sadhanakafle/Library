import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaClient, ReservationType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaClient) {}
  async create(createTransactionDto: CreateTransactionDto) {
    let book = await this.prisma.book.findUnique({
      where: {
        id: createTransactionDto.book_id,
      },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if((book.quantity as number)<=0){
      throw new BadRequestException('book is not available');
    }

    let member = await this.prisma.user.findUnique({
      where: {
        id: createTransactionDto.member_id,
      },
    });
    if (!member) {
      throw new NotFoundException('member not found');
    }
    const existingtransaction = await this.prisma.transaction.findFirst({
      where:{
        book_id:createTransactionDto.book_id,
        member_id:createTransactionDto.member_id,
        type: ReservationType.BORROW,
      },
    });
    if(existingtransaction){
      throw new BadRequestException("book is already borrrowed by the memeber")
    }
    return this.prisma.$transaction(async (prisma) => {//tcl
      const transaction = await prisma.transaction.create({
        data:createTransactionDto,
      });
      await prisma.book.update({
        where: { id: createTransactionDto.book_id },
        data: { quantity: {
          ...(createTransactionDto.type ===  ReservationType.BORROW?{decrement:1}:{increment:1})
        } },
      });
       return transaction;
    });
  }
        
  findAll() {
    return this.prisma.transaction.findMany();
  }
  async findOne(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException('transaction not found');
    }
    return transaction;
  }
  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    await this.findOne(id);
    return this.prisma.transaction.update({
      where:{id},
      data:updateTransactionDto,
    });
    }
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
