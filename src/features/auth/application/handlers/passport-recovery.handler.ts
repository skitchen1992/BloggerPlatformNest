import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { AuthService } from '@features/auth/application/auth.service';
import { RecoveryCodeDtoMapper } from '@features/auth/api/dto/recovery-code.dto';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryHandler
  implements ICommandHandler<PasswordRecoveryCommand, void>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}
  async execute(command: PasswordRecoveryCommand): Promise<void> {
    const { email } = command;

    const { user } = await this.usersRepository.getUserByLoginOrEmail(
      email,
      email,
    );

    if (!user) {
      const recoveryAccessToken = await this.authService.getAccessToken(null);
      await this.authService.sendRecoveryPassEmail(email, recoveryAccessToken);
      return;
    }

    const userId = user._id.toString();

    const recoveryAccessToken = await this.authService.getAccessToken(userId);

    await this.usersRepository.update(
      userId,
      RecoveryCodeDtoMapper(recoveryAccessToken),
    );

    await this.authService.sendRecoveryPassEmail(email, recoveryAccessToken);
  }
}
