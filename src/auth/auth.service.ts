import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Register a new user
  async register(name: string, email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      name,
      email,
      password: hashed,
    });

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }

  // Login a user
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }

  // Forgot password
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    return { token };
  }

  // Reset password
  async resetPassword(token: string, password: string) {
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
