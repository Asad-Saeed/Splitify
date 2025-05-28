import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FriendRequestStatus } from 'src/common/enum/friends/friends.enum';

// Send Friend Request DTO
export class SendFriendRequestDto {
  @ApiProperty({
    example: '60a0a0a0a0a0a0a0a0a0a0a0',
    description: 'ID of the user to send request to',
  })
  @IsNotEmpty()
  @IsString()
  receiverId: string;
}

// Respond Friend Request DTO
export class RespondFriendRequestDto {
  @ApiProperty({
    example: '60a0a0a0a0a0a0a0a0a0a0a0',
    description: 'ID of the friend request',
  })
  @IsNotEmpty()
  @IsString()
  requestId: string;

  @ApiProperty({ enum: FriendRequestStatus, description: 'Response status' })
  @IsNotEmpty()
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;
}
