import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../common/enum/user/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

// Register DTO
export class RegisterDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: UserRole.USER,
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(UserRole))
  role: UserRole;
}

// Login DTO
export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'asadsaeed.dev@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: '#@Asad01',
  })
  @IsNotEmpty()
  password: string;
}

// Forgot Password DTO
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;
}

// Reset Password DTO
export class ResetPasswordDto {
  @ApiProperty({
    description: 'The token of the user',
    example: '1234567890',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
