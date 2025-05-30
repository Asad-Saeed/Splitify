import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument } from './groups.schema';
import {
  CreateGroupDto,
  EditGroupDto,
  AddRemoveMembersDto,
  LeaveGroupDto,
} from './dto/groups.dto';
import { UsersService } from '../users/users.service';
import { generateUniqueSlug } from '../common/utils/slug.util';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    private usersService: UsersService,
  ) {}

  async createGroup(userId: string, dto: CreateGroupDto) {
    // Check for duplicate group name
    const existing = await this.groupModel.findOne({ name: dto.name });
    if (existing) {
      throw new ForbiddenException('Group name already exists');
    }
    // Generate unique slug
    const slug = await generateUniqueSlug(
      dto.name,
      async (slug) => !!(await this.groupModel.findOne({ slug })),
    );
    const group = await this.groupModel.create({
      name: dto.name,
      image: dto.image,
      members: [userId, ...dto.members.filter((id) => id !== userId)],
      admin: userId,
      createdBy: userId,
      slug,
    });
    return {
      status: HttpStatus.CREATED,
      message: 'Group created successfully',
      data: group,
    };
  }

  async editGroup(userId: string, groupId: string, dto: EditGroupDto) {
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    if (group.admin.toString() !== userId)
      throw new ForbiddenException('Only admin can edit group');
    // Validate members if present
    if (dto.members && dto.members.length > 0) {
      const users = await this.usersService['userModel'].find({
        _id: { $in: dto.members },
      });
      if (users.length !== dto.members.length) {
        throw new NotFoundException('One or more member IDs are invalid');
      }
    }
    // If name is being updated, check for duplicate and update slug
    if (dto.name && typeof dto.name === 'string' && dto.name !== group.name) {
      const existing = await this.groupModel.findOne({ name: dto.name });
      if (existing && (existing as any)?._id?.toString() !== groupId) {
        throw new ForbiddenException('Group name already exists');
      }
      group.slug = await generateUniqueSlug(dto.name, async (slug) => {
        const found = await this.groupModel.findOne({ slug });
        return !!found && (found as any)?._id?.toString() !== groupId;
      });
      group.name = dto.name;
    }
    // Assign other fields
    if (dto.image !== undefined) group.image = dto.image;
    if (dto.members !== undefined)
      group.members = dto.members.map((id) => new Types.ObjectId(id));
    await group.save();
    return {
      status: HttpStatus.OK,
      message: 'Group updated successfully',
      data: group,
    };
  }

  async addMembers(userId: string, dto: AddRemoveMembersDto) {
    const group = await this.groupModel.findById(dto.groupId);
    if (!group) throw new NotFoundException('Group not found');

    // Check that each userId exists
    const users = await this.usersService['userModel'].find({
      _id: { $in: dto.userIds },
    });
    if (users.length !== dto.userIds.length) {
      throw new NotFoundException('One or more user IDs are invalid');
    }

    // Check for already existing members
    const existingMemberIds = group.members.map((id) => id.toString());
    const alreadyMembers = dto.userIds.filter((id) =>
      existingMemberIds.includes(id),
    );
    if (alreadyMembers.length > 0) {
      throw new ForbiddenException(
        `User(s) already in group: ${alreadyMembers.join(', ')}`,
      );
    }

    if (group.admin.toString() !== userId)
      throw new ForbiddenException('Only admin can add members');
    // Only add new members
    group.members = [
      ...group.members,
      ...dto.userIds
        .filter((id) => !existingMemberIds.includes(id))
        .map((id) => new Types.ObjectId(id)),
    ];
    await group.save();
    return {
      status: HttpStatus.OK,
      message: 'Members added successfully',
      data: group,
    };
  }

  async removeMembers(userId: string, dto: AddRemoveMembersDto) {
    const group = await this.groupModel.findById(dto.groupId);
    if (!group) throw new NotFoundException('Group not found');
    // Check that each userId exists
    const users = await this.usersService['userModel'].find({
      _id: { $in: dto.userIds },
    });
    if (users.length !== dto.userIds.length) {
      throw new NotFoundException('One or more user IDs are invalid');
    }
    if (group.admin.toString() !== userId)
      throw new ForbiddenException('Only admin can remove members');
    group.members = group.members.filter(
      (id) => !dto.userIds.includes(id.toString()),
    );
    await group.save();
    return {
      status: HttpStatus.OK,
      message: 'Members removed successfully',
      data: group,
    };
  }

  async leaveGroup(userId: string, dto: LeaveGroupDto) {
    const group = await this.groupModel.findById(dto.groupId);
    if (!group) throw new NotFoundException('Group not found');

    if (!group.members.map((id) => id.toString()).includes(userId))
      throw new ForbiddenException('Not a group member');
    group.members = group.members.filter((id) => id.toString() !== userId);
    // If admin leaves, transfer admin to another member or handle as needed
    if (group.admin.toString() === userId) {
      group.admin = group.members[0] || null;
    }
    await group.save();
    return {
      status: HttpStatus.OK,
      message: 'Left group successfully',
      data: group,
    };
  }

  async getGroups(userId: string) {
    const groups = await this.groupModel.find({
      members: { $in: [userId] },
    });
    return {
      status: HttpStatus.OK,
      message: 'Groups fetched successfully',
      data: groups,
    };
  }

  async deleteGroup(userId: string, groupId: string, dto: LeaveGroupDto) {
    const group = await this.groupModel.findById(dto.groupId);
    if (!group) throw new NotFoundException('Group not found');
    if (group.admin.toString() !== userId)
      throw new ForbiddenException('Only admin can delete group');
    await group.deleteOne();
    return {
      status: HttpStatus.OK,
      message: 'Group deleted successfully',
    };
  }
}
