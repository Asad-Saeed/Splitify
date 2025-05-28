import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FriendRequest, FriendRequestDocument } from './friends.schema';
import { User, UserDocument } from 'src/users/users.schema';
import {
  SendFriendRequestDto,
  RespondFriendRequestDto,
} from './dto/friends.dto';
import { FriendRequestStatus } from 'src/common/enum/friends/friends.enum';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(FriendRequest.name)
    private friendRequestModel: Model<FriendRequestDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async sendRequest(userId: string, dto: SendFriendRequestDto) {
    const { receiverId } = dto;
    const sender = (await this.userModel.findById(userId)) as UserDocument;
    const receiver = (await this.userModel.findById(
      receiverId,
    )) as UserDocument;

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }
    const friendRequest = await this.friendRequestModel.create({
      sender: sender._id,
      receiver: receiver._id,
      status: FriendRequestStatus.PENDING,
    });
    return {
      status: HttpStatus.CREATED,
      message: 'Friend request sent successfully',
      data: friendRequest,
    };
  }

  async respondRequest(userId: string, dto: RespondFriendRequestDto) {
    const { requestId, status } = dto;
    const user = (await this.userModel.findById(userId)) as UserDocument;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const friendRequest = await this.friendRequestModel.findById(requestId);
    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }
    friendRequest.status = status;
    await friendRequest.save();
    return {
      status: HttpStatus.OK,
      message: 'Friend request responded successfully',
      data: friendRequest,
    };
  }

  async getFriendsList(userId: string) {
    const user = (await this.userModel.findById(userId)) as UserDocument;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const friendRequests = await this.friendRequestModel.find({
      $or: [{ sender: user._id }, { receiver: user._id }],
    });
    const friendIds = friendRequests?.map((friend: FriendRequestDocument) => {
      if (friend.sender.toString() === user._id) {
        return friend.receiver.toString();
      }
      return friend.sender.toString();
    });
    const friends = await this.userModel.find({ _id: { $in: friendIds } });
    return {
      status: HttpStatus.OK,
      message: 'Friends list fetched successfully',
      data: friends,
    };
  }

  async getFriendRequests(userId: string) {
    const user = (await this.userModel.findById(userId)) as UserDocument;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const friendRequests = await this.friendRequestModel.find({
      receiver: user._id,
      status: FriendRequestStatus.PENDING,
    });
    return {
      status: HttpStatus.OK,
      message: 'Friend requests fetched successfully',
      data: friendRequests,
    };
  }
}
