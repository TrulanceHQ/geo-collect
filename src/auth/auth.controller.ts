import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
  // Req,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthService, LoginResponse } from './auth.service';
import { LocalAuthGuard } from 'src/utils/localguard/local-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { Roles } from 'src/utils/roles/roles.decorator';
// import { RequestWithUser } from './interfaces/request-with-user.interface';
// import { VerifyEmailDto } from './dto/verifyemail.dto';
import { CreateUserDto } from './dto/createuser.dto';
import { LoginUserDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/updateuser.dto';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { ResetPasswordDto } from './dto/resetpassword.dto';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { UserRole } from './schema/user.schema';
// import { ResendVerificationCodeDto } from './dto/resendverificationcode.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('api/v1')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Roles('admin')
  @Post('/create-user')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 409, description: 'Conflict: Email already exists' })
  async create(@Body() userDto: CreateUserDto) {
    const { creatorRole } = userDto;
    if (creatorRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create users');
    }
    return this.authService.createUserByAdmin(userDto);
  }
  @Roles('fieldCoordinator')
  @Post('create-enumerator')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 409, description: 'Conflict: Email already exists' })
  async createEnumerator(@Body() userDto: CreateUserDto) {
    const { creatorRole } = userDto;
    if (creatorRole !== UserRole.FIELDCOORDINATOR) {
      throw new ForbiddenException(
        'Only field coordinators can create enumerators',
      );
    }
    return this.authService.createEnumeratorByFieldCoordinator(userDto);
  }

  // @Post('/verify-email')
  // @ApiOperation({ summary: 'Verify New User Email' })
  // @ApiBody({ type: VerifyEmailDto })
  // @ApiResponse({ status: 200, description: 'Email verified successfully' })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Invalid or expired verification code',
  // })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Unauthorized: Invalid credentials',
  // })
  // async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
  //   const { emailAddress, code } = verifyEmailDto;
  //   await this.authService.verifyEmail(emailAddress, code);
  //   return { message: 'Email verified successfully' };
  // }

  // @Post('/resend-verification-code')
  // @ApiOperation({ summary: 'Resend Verification Code' })
  // @ApiBody({ type: ResendVerificationCodeDto })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Verification code resent successfully',
  // })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // @ApiResponse({ status: 400, description: 'User is already verified' })
  // async resendVerificationCode(
  //   @Body() resendVerificationCodeDto: ResendVerificationCodeDto,
  // ) {
  //   const { emailAddress } = resendVerificationCodeDto;
  //   return this.authService.resendVerificationCode(emailAddress);
  // }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid credentials',
  })
  async login(@Body() userDto: LoginUserDto): Promise<LoginResponse> {
    const loginResponse = await this.authService.login(
      userDto.emailAddress,
      userDto.password,
    );
    if (!loginResponse) {
      throw new Error('Login failed');
    }
    return loginResponse;
  }

  @Roles('admin', 'enumerator')
  @Patch('/update-user/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update user details' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'User details updated successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.authService.updateUser(id, updateUserDto, file);
  }

  @Roles('admin', 'enumerator')
  @Post('/forgot-password')
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Reset code sent to email' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { emailAddress } = forgotPasswordDto;
    await this.authService.forgotPassword(emailAddress);
    return { message: 'Reset code sent to email' };
  }

  @Roles('admin', 'enumerator')
  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset code' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Password reset successfully' };
  }

  @Roles('admin', 'enumerator')
  @Patch('/change-password/:id')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Old password is incorrect',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.updatePassword(id, changePasswordDto);
  }
  @Roles('admin')
  @Get('/user')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [CreateUserDto],
  })
  async findAll() {
    return this.authService.findAll();
  }
}
