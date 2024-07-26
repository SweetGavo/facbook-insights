import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('facebook'))
  async getProfile(@Req() req) {
    return req.user;
  }


  @Post('createOrUpdate')
  async createOrUpdate(@Body() userDto: any): Promise<User> {
    try {
      return await this.usersService.createOrUpdate(userDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
