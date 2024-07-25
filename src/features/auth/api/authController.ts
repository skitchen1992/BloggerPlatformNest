import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { RegistrationUserDto } from './dto/input/registration-user.input.dto';
import { AuthService } from '../application/auth.service';

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
}
