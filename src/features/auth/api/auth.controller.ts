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
import { JwtAuthGuard } from '@infrastructure/guards/bearer-auth-guard.service';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '@features/auth/application/handlers/login.handler';
import { LoginOutputDto } from '@features/auth/api/dto/output/login.output.dto';
import { PasswordRecoveryCommand } from '@features/auth/application/handlers/passport-recovery.handler';
import { NewPassportCommand } from '@features/auth/application/handlers/new-passport.handler';
import { RegistrationConfirmationCommand } from '@features/auth/application/handlers/registration-confirmation.handler';
// Tag для swagger
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() input: LoginDto) {
    const { loginOrEmail, password } = input;

    return await this.commandBus.execute<LoginCommand, LoginOutputDto>(
      new LoginCommand(loginOrEmail, password),
    );
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() input: PasswordRecoveryDto) {
    const { email } = input;

    await this.commandBus.execute<PasswordRecoveryCommand, void>(
      new PasswordRecoveryCommand(email),
    );
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() input: NewPasswordDto) {
    const { newPassword, recoveryCode } = input;

    await this.commandBus.execute<NewPassportCommand, void>(
      new NewPassportCommand(newPassword, recoveryCode),
    );
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() input: RegistrationConfirmationDto) {
    const { code } = input;

    await this.commandBus.execute<RegistrationConfirmationCommand, void>(
      new RegistrationConfirmationCommand(code),
    );
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
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: Request) {
    const user = request.currentUser;
    return await this.authService.me(user!);
  }
}
