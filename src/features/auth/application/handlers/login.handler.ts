import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { UnauthorizedException } from '@nestjs/common';
import {
  LoginOutputDto,
  LoginOutputDtoMapper,
} from '@features/auth/api/dto/output/login.output.dto';
import { AuthService } from '@features/auth/application/auth.service';
import { CookieService } from '@infrastructure/servises/cookie/cookie.service';
import { getUniqueId } from '@utils/utils';
import { COOKIE_KEY } from '@utils/consts';
import { Response } from 'express';
export class LoginCommand {
  constructor(
    public loginOrEmail: string,
    public password: string,
    public res: Response,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler
  implements ICommandHandler<LoginCommand, LoginOutputDto>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}
  async execute(command: LoginCommand): Promise<LoginOutputDto> {
    const { loginOrEmail, password, res } = command;

    const { user } = await this.usersRepository.getUserByLoginOrEmail(
      loginOrEmail,
      loginOrEmail,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const isCorrectPass = await this.authService.isCorrectPass(
      password,
      user.password,
    );

    if (!isCorrectPass) {
      throw new UnauthorizedException();
    }

    const deviceId = getUniqueId();

    const refreshToken = await this.authService.getRefreshToken(
      user._id.toString(),
      deviceId,
    );

    this.cookieService.setCookie(res, COOKIE_KEY.REFRESH_TOKEN, refreshToken);

    return LoginOutputDtoMapper(
      await this.authService.getAccessToken(user._id.toString()),
    );
  }
}
