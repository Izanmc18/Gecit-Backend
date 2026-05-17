import { Controller, Post, Body, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto, RegisterDto, ChangePasswordDto } from './dto';
import { Public, Auth, CurrentUser } from './decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user and get a token' })
  @ApiResponse({ status: 200, description: 'Login successful. Returns the JWT token and user info.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid email or password.' })
  login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new client user' })
  @ApiResponse({ status: 201, description: 'Registration successful. Returns the new user and JWT token.' })
  @ApiResponse({ status: 400, description: 'Bad request. The registration data is invalid.' })
  register(@Body() registerDto: RegisterDto): Promise<LoginResponseDto> {
    return this.authService.register(registerDto);
  }

  @Patch('change-first-password')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password for the first time' })
  @ApiResponse({ status: 200, description: 'Password changed successfully. Returns a success message.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. The user must be authenticated.' })
  async changeFirstPassword(
    @CurrentUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changeFirstPassword(userId, changePasswordDto.newPassword);
    return { message: 'Password changed successfully' };
  }
}
