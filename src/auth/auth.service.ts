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
import { generateStrongPassword } from 'src/utils/password.utils';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from './dto/resetpassword.dto';
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

        // Log the temporary password and role to the console
    console.log(`Temporary password for ${createUserDto.emailAddress}: ${temporaryPassword}`);
    console.log(`Role: ${createUserDto.role}`);

    // await this.emailUtil.sendEmail(
    //   createUserDto.emailAddress,
    //   'Account Created - Temporary Password',
    //   'temporary-password',
    //   {
    //     password: temporaryPassword,
    //     role: createUserDto.role
    //   },
    // );

    return createdUser.save();
  }

  async createEnumeratorByFieldCoordinator(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ emailAddress: createUserDto.emailAddress })
      .exec();
    if (existingUser) {
      throw new ConflictException('Email address has been used by another customer');
    }

    // Ensure the role is enumerator
    if (createUserDto.role !== 'enumerator') {
      throw new ForbiddenException('Field coordinators can only create enumerators');
    }

    const temporaryPassword = generateStrongPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      isVerified: false,
    });

    // Log the temporary password and role to the console
    console.log(`Temporary password for ${createUserDto.emailAddress}: ${temporaryPassword}`);
    console.log(`Role: ${createUserDto.role}`);

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

  async resetPassword(
    resetPasswordDto: ResetPasswordDto
  ): Promise<void> {
    const user = await this.userModel.findOne({
      emailAddress: resetPasswordDto.emailAddress,
      resetToken: resetPasswordDto.token
    }).exec();
    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
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
}
