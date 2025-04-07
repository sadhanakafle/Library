import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { payload } from 'src/interface/payload';
//import { payload } from 'src/interface/payload';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto,@Req() req:payload) {
    createMemberDto.user_id = req.payload.id;
    return this.membersService.create(createMemberDto);
  }

  @Get()
  findAll(@Req() req:payload) {
    return this.membersService.findAll(req.payload.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req:payload) {
    return this.membersService.findOne(+id,req.payload.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto,@Req() req:payload) {
    updateMemberDto.user_id = req.payload.id;
    return this.membersService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req:payload) {
    return this.membersService.remove(+id, req.payload.id);
  }
}
