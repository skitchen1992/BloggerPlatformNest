import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegistrationUserDto } from './dto/input/registration-user.input.dto';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '@features/auth/api/dto/input/login.input.dto';
import { PasswordRecoveryDto } from '@features/auth/api/dto/input/password-recovery.input.dto';
import { NewPasswordDto } from '@features/auth/api/dto/input/new-password.input.dto';
import { RegistrationConfirmationDto } from '@features/auth/api/dto/input/registration-confirmation.input.dto';
import { RegistrationEmailResendingDto } from '@features/auth/api/dto/input/registration-email-resending.input.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
// Tag для swagger
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() input: LoginDto) {
    const { loginOrEmail, password } = input;

    return await this.authService.login(loginOrEmail, password);
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() input: PasswordRecoveryDto) {
    const { email } = input;

    await this.authService.recoveryPassword(email);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() input: NewPasswordDto) {
    const { newPassword, recoveryCode } = input;

    await this.authService.newPassword(newPassword, recoveryCode);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() input: RegistrationConfirmationDto) {
    const { code } = input;

    await this.authService.registrationConfirmation(code);
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() input: RegistrationUserDto) {
    const { login, password, email } = input;

    await this.authService.registration(login, password, email);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() input: RegistrationEmailResendingDto,
  ) {
    const { email } = input;

    await this.authService.registrationEmailResending(email);
  }

  @ApiSecurity('bearer')
  //@UseGuards(BearerAuthGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() request: Request) {
    const user = request.currentUser;
    console.log('request.currentUser', request.currentUser);
    return await this.authService.me(user!);
  }
}
