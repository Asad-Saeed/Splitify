import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SplitType } from './expenses.schema';
import { ApiProperty } from '@nestjs/swagger';

class ParticipantDto {
  @ApiProperty({
    example: '60a0a0a0a0a0a0a0a0a0a0a0',
    description: 'The ID of the user',
  })
  @IsMongoId()
  user: string;

  @ApiProperty({
    example: 100,
    description: 'The amount of the expense',
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    example: 100,
    description: 'The percentage of the expense',
  })
  @IsOptional()
  @IsNumber()
  percentage?: number;
}

export class CreateExpenseDto {
  @ApiProperty({
    example: 'Dinner with friends',
    description: 'The title of the expense',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 100,
    description: 'The amount of the expense',
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: SplitType.EQUAL,
    description: 'The split type of the expense',
  })
  @IsEnum(SplitType)
  splitType: SplitType;

  @ApiProperty({
    example: new Date(),
    description: 'The date of the expense',
  })
  @IsDateString()
  date: Date;

  @ApiProperty({
    example: 'Food',
    description: 'The category of the expense',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'Notes',
    description: 'The notes of the expense',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: '60a0a0a0a0a0a0a0a0a0a0a0',
    description: 'The ID of the group',
  })
  @IsOptional()
  @IsMongoId()
  group?: string;

  @ApiProperty({
    example: [
      {
        user: '60a0a0a0a0a0a0a0a0a0a0a0',
        amount: 100,
        percentage: 50,
      },
    ],
    description: 'The participants of the expense',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantDto)
  participants: ParticipantDto[];
}

export class UpdateExpenseDto {
  @ApiProperty({
    example: 'Dinner with friends',
    description: 'The title of the expense',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 100,
    description: 'The amount of the expense',
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    example: SplitType.EQUAL,
    description: 'The split type of the expense',
  })
  @IsOptional()
  @IsEnum(SplitType)
  splitType?: SplitType;

  @ApiProperty({
    example: '2021-01-01',
    description: 'The date of the expense',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    example: 'Food',
    description: 'The category of the expense',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'Notes',
    description: 'The notes of the expense',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: '60a0a0a0a0a0a0a0a0a0a0a0',
    description: 'The ID of the group',
  })
  @IsOptional()
  @IsMongoId()
  group?: string;

  @ApiProperty({
    example: [
      {
        user: '60a0a0a0a0a0a0a0a0a0a0a0',
        amount: 100,
        percentage: 50,
      },
    ],
    description: 'The participants of the expense',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantDto)
  participants?: ParticipantDto[];
}
