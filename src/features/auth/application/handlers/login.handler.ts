import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { User } from '@features/users/domain/user.entity';
import { UsersService } from '@features/users/application/users.service';
import { UnauthorizedException } from '@nestjs/common';
import {
  LoginOutputDto,
  LoginOutputDtoMapper,
} from '@features/auth/api/dto/output/login.output.dto';
import { AuthService } from '@features/auth/application/auth.service';

export class LoginCommand {
  constructor(
    public loginOrEmail: string,
    public password: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler
  implements ICommandHandler<LoginCommand, LoginOutputDto>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}
  async execute(command: LoginCommand): Promise<LoginOutputDto> {
    const { loginOrEmail, password } = command;

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

    return LoginOutputDtoMapper(
      await this.authService.getAccessToken(user._id.toString()),
    );
  }
}
