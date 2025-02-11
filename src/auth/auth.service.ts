/* eslint-disable prettier/prettier */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schema/user.schema';
import { ChangePasswordDto} from './dto/changepassword.dto';
import * as bcrypt from 'bcryptjs';
import { isValidObjectId } from 'mongoose';
import { EmailUtil } from '../utils/email/email.util';
import { CreateUserDto } from './dto/createuser.dto';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { UpdateUserDto } from './dto/updateuser.dto';
export interface LoginResponse {
  accessToken: string;
  user: User;
}
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cloudinaryService: CloudinaryService,
    private jwtService: JwtService,
    private emailUtil: EmailUtil,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ emailAddress: createUserDto.emailAddress })
      .exec();
    if (existingUser) {
      throw new ConflictException(
        'Email address has been used by another customer',
      );
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 2,
    ); // Code expires in 2 minutes

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
      isVerified: false,
    });

    await this.emailUtil.sendEmail(
      createUserDto.emailAddress,
      'Email Verification',
      'verification-code',
      { code: verificationCode },
    );

    return createdUser.save();
  }
  async login(
    emailAddress: string,
    password: string,
  ): Promise<LoginResponse | null> {
    const user = await this.userModel.findOne({ emailAddress }).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('Email not verified');
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate JWT token
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
  async verifyEmail(emailAddress: string, code: string): Promise<void> {
    const user = await this.userModel.findOne({ emailAddress }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (
      user.verificationCode !== code ||
      user.verificationCodeExpires && user.verificationCodeExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired verification code');
    }
    user.isVerified = true;
    user.isActive = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
  }
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async forgotPassword(emailAddress: string): Promise<void> {
    const user = await this.userModel.findOne({ emailAddress }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date();
    resetCodeExpires.setMinutes(resetCodeExpires.getMinutes() + 2);
    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    await this.emailUtil.sendEmail(
      emailAddress,
      'Reset Password',
      'reset-password',
      { code: resetCode },
    );

    return;
  }
  async resetPassword(
    emailAddress: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel.findOne({ emailAddress }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.resetCode !== code || !user.resetCodeExpires || user.resetCodeExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    const isSameAsOldPassword = await bcrypt.compare(
      newPassword,
      user.password,
    );
    if (isSameAsOldPassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
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
  async updateUserStatus(id: string, isActive: boolean): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, { isActive }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
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
  async countUsersByRole(role: string): Promise<number> {
    return this.userModel.countDocuments({ role: role }).exec();
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
async resendVerificationCode(
    emailAddress: string,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ emailAddress }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 2,
    );
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    await this.emailUtil.sendEmail(
      emailAddress,
      'Email Verification',
      'verification-code',
      { code: verificationCode },
    );

    return { message: 'Verification code resent successfully' };
  }
}
