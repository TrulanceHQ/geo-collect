import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';

@Schema({ timestamps: true })
export class NgStates extends Document {
  @Prop({ type: [String], required: true })
  ngstates: string[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;
}

export const NgStatesSchema = SchemaFactory.createForClass(NgStates);
