import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@Schema({ timestamps: true })
@ObjectType()
export class User {
  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field(() => UserRole)
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Field()
  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiry?: Date;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpiry?: Date;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
