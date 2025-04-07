import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaClient) {}
  async create(createTransactionDto: CreateTransactionDto) {
    let member = await this.prisma.user.findUnique({
      where: {
        id: createTransactionDto.member_id,
      },
    });
    if (!member) {
      throw new NotFoundException('member not found');
    }
    let book = await this.prisma.book.findUnique({
      where: {
        id: createTransactionDto.book_id,
      },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if((book.quantity as number)<=0){

    }
    const BorrowedBookscount = await this.prisma.transaction.count({
      where: {
        user_id: createTransactionDto.user_id,
        type: 'BORROW',
      },
    });
    return await this.prisma.$transaction(async (prisma) => {//tcl
      if (createTransactionDto.type === 'BORROW') {
        if (BorrowedBookscount >= 5) {
          throw new BadRequestException('User has reached the borrowing limit');
        }

        if (book.quantity <= 0) {
          throw new BadRequestException('Book is out of stock.');
        }

        await prisma.book.update({
          where: { id: createTransactionDto.book_id },
          data: { quantity: book.quantity - 1 },
        });
      }
      if (createTransactionDto.type === 'RETURN') {
        const BORROW = await this.prisma.transaction.findFirst({
          where: {
            user_id: createTransactionDto.user_id,
            type: 'BORROW',
            book_id: createTransactionDto.book_id,
          },
        });

        await prisma.book.update({
          where: { id: createTransactionDto.book_id },
          data: { quantity: book.quantity + 1 },
        });
      }

      return await prisma.transaction.create({
        data: createTransactionDto,
      });
    });
  }
  findAll() {
    return this.prisma.transaction.findMany();
  }
  async findOne(id: number) {
    const data = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException('transaction not found');
    }
    return data;
  }
  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    let transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return await this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
