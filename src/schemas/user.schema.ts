import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  facebookId: string;

  @Prop()
  name: string;

  @Prop()
  friendsCount: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
