import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { FriendRequestStatus } from 'src/common/enum/friends/friends.enum';
import { User } from 'src/users/users.schema';

export type FriendRequestDocument = FriendRequest & Document;

@Schema({ timestamps: true })
export class FriendRequest {
  @ApiProperty({
    example: '60a0a0a0a0a0a0a0a0a0a0a0',
    description: 'The ID of the sender',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: User | Types.ObjectId;

  @ApiProperty({
    example: '60a0a0a0a0a0a0a0a0a0a0a0',
    description: 'The ID of the receiver',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiver: User | Types.ObjectId;

  @ApiProperty({
    example: FriendRequestStatus.PENDING,
    description: 'The status of the friend request',
  })
  @Prop({
    type: String,
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
