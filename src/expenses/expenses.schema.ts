import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/users.schema';
import { Group } from 'src/groups/groups.schema';

export type ExpenseDocument = Expense & Document;

export enum SplitType {
  EQUAL = 'equal',
  EXACT = 'exact',
  PERCENTAGE = 'percentage',
}

@Schema({ timestamps: true })
export class Expense {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: SplitType })
  splitType: SplitType;

  @Prop({ required: true })
  date: Date;

  @Prop()
  category?: string;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: false })
  group?: Group | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User | Types.ObjectId;

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number },
        percentage: { type: Number },
      },
    ],
    required: true,
  })
  participants: Array<{
    user: User | Types.ObjectId;
    amount?: number;
    percentage?: number;
  }>;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
