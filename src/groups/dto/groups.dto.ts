import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
} from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Hostel Expense', description: 'Group name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://example.com/group-image.png',
    description: 'Group image',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    example: ['64f1a2b3c4d5e6f7a8b9c0d1', '64f1a2b3c4d5e6f7a8b9c0d2'],
    description: 'Array of user IDs to add as members',
  })
  @IsArray()
  @IsMongoId({
    each: true,
    message: 'Each userId must be a valid MongoDB ObjectId',
  })
  members: string[];
}

export class EditGroupDto extends PartialType(CreateGroupDto) {}

export class AddRemoveMembersDto {
  @ApiProperty({ example: '64f1a2b3c4d5e6f7a8b9c0d3', description: 'Group ID' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'groupId must be a valid MongoDB ObjectId' })
  groupId: string;

  @ApiProperty({
    example: ['64f1a2b3c4d5e6f7a8b9c0d4', '64f1a2b3c4d5e6f7a8b9c0d5'],
    description: 'User IDs to add or remove',
  })
  @IsArray()
  @IsMongoId({
    each: true,
    message: 'Each userId must be a valid MongoDB ObjectId',
  })
  userIds: string[];
}

export class LeaveGroupDto {
  @ApiProperty({ example: '64f1a2b3c4d5e6f7a8b9c0d6', description: 'Group ID' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'groupId must be a valid MongoDB ObjectId' })
  groupId: string;
}
