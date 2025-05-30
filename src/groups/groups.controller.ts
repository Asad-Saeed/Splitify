import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Patch,
  Request,
  Param,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from 'src/common/enum/user/roles.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GroupsService } from './groups.service';
import {
  CreateGroupDto,
  EditGroupDto,
  AddRemoveMembersDto,
  LeaveGroupDto,
} from './dto/groups.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { RequestUser } from 'src/common/types/user.types';

@ApiTags('groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('groups')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @Roles(UserRole.USER)
  createGroup(@Request() req: ExpressRequest, @Body() dto: CreateGroupDto) {
    const user = req.user as RequestUser;
    return this.groupsService.createGroup(user.userId, dto);
  }

  @Patch('add-members')
  @Roles(UserRole.USER)
  addMembers(
    @Request() req: ExpressRequest,
    @Body() addRemoveMembersDto: AddRemoveMembersDto,
  ) {
    console.log('addMembers called, dto==========:', addRemoveMembersDto);
    const user = req.user as RequestUser;
    return this.groupsService.addMembers(user.userId, addRemoveMembersDto);
  }

  @Patch('remove-members')
  @Roles(UserRole.USER)
  removeMembers(
    @Request() req: ExpressRequest,
    @Body() dto: AddRemoveMembersDto,
  ) {
    const user = req.user as RequestUser;
    return this.groupsService.removeMembers(user.userId, dto);
  }

  @Patch('leave')
  @Roles(UserRole.USER)
  leaveGroup(@Request() req: ExpressRequest, @Body() dto: LeaveGroupDto) {
    const user = req.user as RequestUser;
    return this.groupsService.leaveGroup(user.userId, dto);
  }

  @Get()
  @Roles(UserRole.USER)
  getGroups(@Request() req: ExpressRequest) {
    const user = req.user as RequestUser;
    return this.groupsService.getGroups(user.userId);
  }

  @Patch(':id')
  @Roles(UserRole.USER)
  editGroup(
    @Request() req: ExpressRequest,
    @Param('id') id: string,
    @Body() dto: EditGroupDto,
  ) {
    const user = req.user as RequestUser;
    return this.groupsService.editGroup(user.userId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  deleteGroup(
    @Request() req: ExpressRequest,
    @Param('id') id: string,
    @Body() dto: LeaveGroupDto,
  ) {
    const user = req.user as RequestUser;
    return this.groupsService.deleteGroup(user.userId, id, dto);
  }
}
