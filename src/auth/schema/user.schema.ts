import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  ENUMERATOR = 'enumerator',
  FIELDCOORDINATOR = 'fieldCoordinator',
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

  @Prop({ required: false, enum: UserRole })
  creatorRole: UserRole; // <-- Add this field

  // @Prop({ required: false }) // Tracks which field coordinator created enumerator
  // fieldCoordinatorId: Types.ObjectId;

  @Prop({ required: false })
  selectedState: string; // Store the selected state name or ID

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }) // Use Types.ObjectId
  // fieldCoordinatorId?: Types.ObjectId;

  //  type: mongoose.Schema.Types.ObjectId,
  // @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Use Types.ObjectId
  // fieldCoordinatorId?: Types.ObjectId;
  // @Prop({ required: false })
  // fieldCoordinatorId?: Types.ObjectId; // Ensure this is added for the link between field coordinator and enumerator

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

  // // Add the assignedTo field to refer to another User (optional)
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  // assignedTo?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  creatorId: Types.ObjectId; // This should be the field you're using to track who created the user
}

export const UserSchema = SchemaFactory.createForClass(User);
