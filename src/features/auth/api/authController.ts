import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegistrationUserDto } from './dto/input/registration-user.input.dto';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '@features/auth/api/dto/input/login.input.dto';
import { PasswordRecoveryDto } from '@features/auth/api/dto/input/password-recovery.input.dto';
import { NewPasswordDto } from '@features/auth/api/dto/input/new-password.input.dto';

// Tag для swagger
@ApiTags('Auth')
@Controller('auth')
// Установка guard на весь контроллер
//@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  async registration(@Body() input: RegistrationUserDto) {
    const { login, password, email } = input;

    await this.authService.registration(login, password, email);
  }

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
}
