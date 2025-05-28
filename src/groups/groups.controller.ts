import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from 'src/common/enum/user/roles.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupsController {
  @Post()
  @Roles(UserRole.USER)
  createGroup(@Body() body: any) {
    // Only user or admin can create group
  }
  @Get()
  @Roles(UserRole.USER)
  getGroups() {
    return {
      message: 'Groups fetched successfully',
    };
  }
}
