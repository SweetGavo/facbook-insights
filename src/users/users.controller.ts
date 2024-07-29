import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards ,Put ,Delete ,Param} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/schemas/user.schema';


interface CreateUserDto {
  facebookId: string;
  name: string;
  friendsCount: number;
}

interface UpdateUserDto {
  name?: string;
  friendsCount?: number;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('facebook'))
  async getProfile(@Req() req) {
    return req.user;
  }


  @Post('createOrUpdate')
  async createOrUpdate(@Body() userDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.createOrUpdate(userDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }



  @Put(':facebookId')
  async updateUser(
    @Param('facebookId') facebookId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.usersService.updateUser(facebookId, updateUserDto);
    } catch (error) {
      // Handle the error or rethrow it
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':facebookId')
  async deleteUser(@Param('facebookId') facebookId: string): Promise<{ message: string }> {
    try {
      return await this.usersService.deleteUser(facebookId);
    } catch (error) {
      // Handle the error or rethrow it
      throw new BadRequestException(error.message);
    }
  }

}
