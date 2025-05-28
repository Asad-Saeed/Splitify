import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import {
  SendFriendRequestDto,
  RespondFriendRequestDto,
} from './dto/friends.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { RequestUser } from 'src/common/types/user.types';

@ApiTags('friends')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('friends')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('request')
  sendRequest(
    @Request() req: ExpressRequest,
    @Body() dto: SendFriendRequestDto,
  ) {
    const user = req.user as RequestUser;
    return this.friendsService.sendRequest(user.userId, dto);
  }

  @Patch('respond')
  respondRequest(
    @Request() req: ExpressRequest,
    @Body() dto: RespondFriendRequestDto,
  ) {
    const user = req.user as RequestUser;
    return this.friendsService.respondRequest(user.userId, dto);
  }

  @Get('list')
  getFriendsList(@Request() req: ExpressRequest) {
    const user = req.user as RequestUser;
    return this.friendsService.getFriendsList(user.userId);
  }

  @Get('requests')
  getFriendRequests(@Request() req: ExpressRequest) {
    const user = req.user as RequestUser;
    return this.friendsService.getFriendRequests(user.userId);
  }
}
