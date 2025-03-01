/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable prettier/prettier */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schema/user.schema';
import { ChangePasswordDto } from './dto/changepassword.dto';
import * as bcrypt from 'bcryptjs';
import { isValidObjectId } from 'mongoose';
import { EmailUtil } from '../utils/email/email-util.service';
import { CreateUserDto } from './dto/createuser.dto';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { UpdateUserDto } from './dto/updateuser.dto';
import { generateStrongPassword } from 'src/utils/password.utils';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from './dto/resetpassword.dto';
import {
  SurveyResponse,
  SurveyResponseDocument,
} from 'src/users/enumerator/survey-response.schema';
import mongoose from 'mongoose';
export interface LoginResponse {
  accessToken: string;
  user: User;
}
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SurveyResponse.name)
    private surveyResponseModel: Model<SurveyResponseDocument>,
    private cloudinaryService: CloudinaryService,
    private jwtService: JwtService,
    private emailUtil: EmailUtil,
  ) {}
  async createUserByAdmin(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ emailAddress: createUserDto.emailAddress })
      .exec();
    if (existingUser) {
      throw new ConflictException(
        'Email address has been used by another customer',
      );
    }

    const temporaryPassword = generateStrongPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      isVerified: false,
    });

    await this.emailUtil.sendEmail(
      createUserDto.emailAddress,
      'Account Created - Temporary Password',
      'temporary-password',
      {
        password: temporaryPassword,
        role: createUserDto.role,
      },
    );

    return createdUser.save();
  }

  async createEnumeratorByFieldCoordinator(
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ emailAddress: createUserDto.emailAddress })
      .exec();
    if (existingUser) {
      throw new ConflictException(
        'Email address has been used by another customer',
      );
    }

    // Ensure the role is enumerator
    if (createUserDto.role !== 'enumerator') {
      throw new ForbiddenException(
        'Field coordinators can only create enumerators',
      );
    }

    const temporaryPassword = generateStrongPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      isVerified: false,
      // fieldCoordinatorId: createUserDto.fieldCoordinatorId, // Note: ensure the DTO includes fieldCoordinatorId
    });

    await this.emailUtil.sendEmail(
      createUserDto.emailAddress,
      'Account Created - Temporary Password',
      'temporary-password',
      {
        password: temporaryPassword,
        role: createUserDto.role,
      },
    );

    return createdUser.save();
  }

  async countEnumeratorsByFieldCoordinator(
    fieldCoordinatorId: string,
  ): Promise<number> {
    return this.userModel
      .countDocuments({ fieldCoordinatorId, role: 'enumerator' })
      .exec();
  }

  async getEnumeratorsByFieldCoordinator(
    fieldCoordinatorId: string,
  ): Promise<User[]> {
    return this.userModel
      .find({ fieldCoordinatorId, role: 'enumerator' })
      .exec();
  }

  // //get survey responses by field coord
  // async getSurveyResponsesByEnumeratorId(
  //   enumeratorId: string,
  // ): Promise<SurveyResponse[]> {
  //   return this.surveyResponseModel.find({ enumeratorId }).exec();
  // }

  // async getSurveyResponsesByFieldCoordinator(
  //   fieldCoordinatorId: string,
  // ): Promise<SurveyResponse[]> {
  //   const enumerators =
  //     await this.getEnumeratorsByFieldCoordinator(fieldCoordinatorId);

  //   const surveyResponses = await Promise.all(
  //     enumerators.map(async (enumerator) => {
  //       const enumeratorId = enumerator._id as string; // Ensure the type is string
  //       return this.getSurveyResponsesByEnumeratorId(enumeratorId);
  //     }),
  //   );

  //   return surveyResponses.flat();
  // }

  // In your survey service (or a related service)

  // async getSurveyResponsesByFieldCoordinator(
  //   fieldCoordinatorId: string
  // ): Promise<SurveyResponse[]> {
  //   // Step 1: Retrieve all enumerators created by the given field coordinator.
  //   const enumerators = await this.userModel
  //     .find({ fieldCoordinatorId, role: 'enumerator' })
  //     .select('_id')
  //     .exec();

  //   // Map to get an array of enumerator IDs.
  //   const enumeratorIds = enumerators.map((user) => user._id);

  //   // If there are no enumerators, optionally return an empty array.
  //   if (!enumeratorIds.length) {
  //     return [];
  //   }

  //   // Step 2: Find survey responses that were collected by these enumerators.
  //   return this.surveyResponseModel
  //     .find({ enumeratorId: { $in: enumeratorIds } })
  //     .exec();
  // }

  // async getSurveyResponsesByFieldCoordinator(
  //   fieldCoordinatorId: string,
  // ): Promise<any[]> {
  //   return this.surveyResponseModel.aggregate([
  //     {
  //       $lookup: {
  //         from: 'users', // Make sure this collection name matches your users collection.
  //         localField: 'enumeratorId',
  //         foreignField: '_id',
  //         as: 'enumeratorDetails',
  //       },
  //     },
  //     { $unwind: '$enumeratorDetails' },
  //     {
  //       $match: {
  //         'enumeratorDetails.fieldCoordinatorId': new mongoose.Types.ObjectId(
  //           fieldCoordinatorId,
  //         ),
  //       },
  //     },
  //     // Optionally, you can add more stages such as $project to shape your final output.
  //   ]);
  // }

  async login(
    emailAddress: string,
    password: string,
  ): Promise<LoginResponse | null> {
    const user = await this.userModel.findOne({ emailAddress }).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      user.isVerified = true;
      user.isActive = true;
      await user.save();

      const payload = {
        emailAddress: user.emailAddress,
        sub: user._id,
        roles: user.role,
      };

      const accessToken = this.jwtService.sign(payload);
      return { accessToken, user };
    }
    throw new UnauthorizedException('Username or Password Incorrect');
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async forgotPassword(emailAddress: string): Promise<void> {
    const user = await this.userModel.findOne({ emailAddress }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const resetToken = uuidv4();
    const resetTokenExpires = new Date();
    resetTokenExpires.setMinutes(resetTokenExpires.getMinutes() + 5);

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}?token=${resetToken}`;

    await this.emailUtil.sendResetPasswordEmail(
      emailAddress,
      'Password Reset Request',
      'reset-password',
      { resetLink },
    );

    return;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.userModel
      .findOne({
        emailAddress: resetPasswordDto.emailAddress,
        resetToken: resetPasswordDto.token,
      })
      .exec();
    if (
      !user ||
      !user.resetTokenExpires ||
      user.resetTokenExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const isSameAsOldPassword = await bcrypt.compare(
      resetPasswordDto.newPassword,
      user.password,
    );
    if (isSameAsOldPassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }
    user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
  }

  async findUsersByRole(
    role: string,
    page: number,
    limit: number,
    filter: Record<string, any>,
  ): Promise<User[]> {
    const skip = (page - 1) * limit;
    const query: Record<string, any> = { role, ...filter };
    return this.userModel.find(query).skip(skip).limit(limit).exec();
  }

  //admin
  async findUserById(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  //enum
  async findEnumById(id: string, currentUserId: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new ForbiddenException('Invalid user ID format');
    }

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // // Enumerator can only view their own details
    // if (user._id.toString() !== currentUserId) {
    //   throw new ForbiddenException(
    //     "You are not authorized to access this user's details",
    //   );
    // }

    // Type-cast user._id and creatorId to ObjectId before comparing them
    const userId =
      user._id instanceof Types.ObjectId ? user._id.toString() : user._id;
    const creatorId =
      user.creatorId instanceof Types.ObjectId
        ? user.creatorId.toString()
        : user.creatorId;

    if (userId !== currentUserId && creatorId !== currentUserId) {
      throw new ForbiddenException(
        "You are not authorized to access this user's details",
      );
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  async updateUser(
    id: string,
    UpdateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<{ message: string; user: User }> {
    if (file) {
      const imageUrl = await this.cloudinaryService.uploadImage(file, 'users');
      UpdateUserDto.image = imageUrl;
    }
    // Filter out undefined, null, or empty values
    const filteredUpdates = Object.fromEntries(
      Object.entries(UpdateUserDto).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, v]) => v !== undefined && v !== '',
      ),
    );

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: filteredUpdates },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User updated successfully', user: updatedUser };
  }

  async updatePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!(await bcrypt.compare(changePasswordDto.oldPassword, user.password))) {
      throw new BadRequestException('Old password is incorrect');
    }
    const isSameAsOldPassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.password,
    );
    if (isSameAsOldPassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await user.save();
    return { message: 'Password updated successfully' };
  }

  //opeyemi

  async countUsersByRole(): Promise<Record<string, number>> {
    const roles = ['fieldCoordinator', 'enumerator']; // Adjust roles as needed
    const counts: Record<string, number> = {};

    for (const role of roles) {
      counts[role] = await this.userModel.countDocuments({ role }).exec();
    }

    return counts;
  }

  // async findEnumeratorsByFieldCoordinator(
  //   fieldCoordinatorId: string,
  // ): Promise<User[]> {
  //   if (!isValidObjectId(fieldCoordinatorId)) {
  //     throw new BadRequestException('Invalid field coordinator ID format');
  //   }

  //   const enumerators = await this.userModel
  //     .find({
  //       role: 'enumerator',
  //       fieldCoordinator: fieldCoordinatorId,
  //     })
  //     .exec();

  //   if (!enumerators || enumerators.length === 0) {
  //     throw new NotFoundException(
  //       'No enumerators found for this field coordinator',
  //     );
  //   }

  //   return enumerators;
  // }

  // Add the new method to find enumerators by fieldCoordinatorId
  async findEnumeratorsByFieldCoordinator(
    fieldCoordinatorId: string,
  ): Promise<User[]> {
    const users = await this.userModel.find({ fieldCoordinatorId }).exec();
    if (!users.length) {
      throw new NotFoundException(
        'No enumerators found for this field coordinator',
      );
    }
    return users;
  }
}
