import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { payload } from 'src/interface/payload';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Post()
  create(@Body() createBookDto: CreateBookDto,@Req() req:payload) {
    createBookDto.user_id = req.payload.id
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll(@Req() req:payload) {
    return this.booksService.findAll(req.payload.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req:payload) {
    return this.booksService.findOne(+id,req.payload.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto, @Req() req:payload) {
    updateBookDto.user_id =req.payload.id
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Req() req:payload) {
    return this.booksService.remove(+id, req.payload.id);
  }
}
