import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as Joi from '@hapi/joi';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createOrUpdate(userDto: any): Promise<User> {
    const schema = Joi.object({
      facebookId: Joi.string().required(),
      name: Joi.string().required(),
      friendsCount: Joi.number().required(),
    });

    const { error } = schema.validate(userDto);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const user = await this.userModel.findOne({ facebookId: userDto.facebookId });
    if (user) {
      user.name = userDto.name;
      user.friendsCount = userDto.friendsCount;
      return user.save();
    }
    return this.userModel.create(userDto);
  }
}
