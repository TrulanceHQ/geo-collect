import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';

export type DataEntryDocument = DataEntry & Document;

@Schema({ timestamps: true })
export class DataEntry {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  enumerator: Types.ObjectId; // Enumerator who submitted the entry

  @Prop({ type: [String], required: true })
  answers: string[]; // List of answers corresponding to data entry questions

  @Prop({ type: String, required: true })
  formId: string; // Identifier for the form filled by the enumerator

  @Prop({ type: Boolean, default: true })
  isValid: boolean; // Whether the entry passed validation checks
}

export const DataEntrySchema = SchemaFactory.createForClass(DataEntry);
