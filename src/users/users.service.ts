import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as Joi from '@hapi/joi';

interface CreateUserDto {
  facebookId: string;
  name: string;
  friendsCount: number;
}

interface UpdateUserDto {
  name?: string;
  friendsCount?: number;
}


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private readonly userSchema = Joi.object({
    facebookId: Joi.string().required(),
    name: Joi.string().required(),
    friendsCount: Joi.number().required(),
  });

  private readonly updateUserSchema = Joi.object({
    name: Joi.string(),
    friendsCount: Joi.number(),
  });


  async createOrUpdate(userDto: CreateUserDto): Promise<User> {
    const schema = Joi.object({
      facebookId: Joi.string().required(),
      name: Joi.string().required(),
      friendsCount: Joi.number().required(),
    });

    const { error } = schema.validate(userDto);
    if (error) {
      throw new BadRequestException(`Validation error: ${error.details[0].message}`);
    }

    const user = await this.userModel.findOne({ facebookId: userDto.facebookId });
    if (user) {
      user.name = userDto.name;
      user.friendsCount = userDto.friendsCount;
      return user.save();
    }
    return this.userModel.create(userDto);
  }




  async updateUser(facebookId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { error } = this.updateUserSchema.validate(updateUserDto);
    if (error) {
      throw new BadRequestException(`Validation error: ${error.details[0].message}`);
    }

    const user = await this.userModel.findOne({ facebookId });
    if (!user) {
      throw new NotFoundException(`User with Facebook ID ${facebookId} not found`);
    }

    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.friendsCount !== undefined) user.friendsCount = updateUserDto.friendsCount;

    return user.save();
  }




  async deleteUser(facebookId: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ facebookId });
    if (!user) {
      throw new NotFoundException(`User with Facebook ID ${facebookId} not found`);
    }

    await this.userModel.deleteOne({user});
    return { message: `User with Facebook ID ${facebookId} deleted successfully` };
  }
}

