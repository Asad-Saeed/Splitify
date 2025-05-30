import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/users.schema';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop()
  image?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  members: (User | Types.ObjectId)[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  admin: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User | Types.ObjectId;

  @Prop({ required: true, unique: true })
  slug: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
