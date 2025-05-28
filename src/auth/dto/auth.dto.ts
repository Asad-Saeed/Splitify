import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../common/enum/user/roles.enum';

// Register DTO
export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(UserRole))
  role: UserRole;
}

// Login DTO
export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

// Forgot Password DTO
export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

// Reset Password DTO
export class ResetPasswordDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
