import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Register a new user
  async register(registerDto: RegisterDto) {
    const { name, email, password, role } = registerDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      name,
      email,
      password: hashed,
      role,
    });

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }

  // Login a user
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: process.env.LOGIN_JWT_EXPIRE!,
    });
    return { user, token };
  }

  // Forgot password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: process.env.RESET_JWT_EXPIRE!,
    });
    return { token };
  }

  // Reset password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;
    let decoded: { sub: string; email: string };

    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    const user = await this.usersService.findByEmail(decoded.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashed = await bcrypt.hash(password, 10);
    await this.usersService.updateOne(user._id as string, { password: hashed });
    return { message: 'Password reset successful' };
  }
}
