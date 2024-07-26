import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegistrationUserDto } from './dto/input/registration-user.input.dto';
import { AuthService } from '../application/auth.service';
import { LoginUserDto } from '@features/auth/api/dto/input/login-user.input.dto';

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
  async login(@Body() input: LoginUserDto) {
    const { loginOrEmail, password } = input;

    return await this.authService.login(loginOrEmail, password);
  }
}
