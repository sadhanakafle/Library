import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { PrismaClient } from '@prisma/client';
import { MembersController } from './members.controller';

@Module({
  controllers: [MembersController],
  providers: [MembersService, PrismaClient],
})
export class MembersModule {}
