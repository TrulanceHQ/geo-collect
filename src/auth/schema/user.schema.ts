import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  ENUMERATOR = 'enumerator',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: false })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: true, unique: true })
  emailAddress: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: false })
  createdAt?: Date;

  @Prop({ required: false })
  updatedAt?: Date;

  @Prop({ required: false })
  verificationCode?: string;

  @Prop({ required: false })
  verificationCodeExpires?: Date;

  @Prop({ required: false })
  resetToken?: string;

  @Prop({ required: false })
  resetTokenExpires?: Date;

  @Prop({ enum: Gender, required: false })
  gender?: Gender;

  @Prop({ required: false })
  phoneNumber?: string;

  @Prop({ required: false })
  image?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
