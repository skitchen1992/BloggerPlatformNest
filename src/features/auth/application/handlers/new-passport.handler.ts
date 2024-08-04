import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '@features/auth/application/auth.service';
import { fromUnixTimeToISO, getCurrentDate, isExpiredDate } from '@utils/dates';
import { NewPasswordDtoMapper } from '@features/auth/api/dto/new-password.dto';

export class NewPassportCommand {
  constructor(
    public newPassword: string,
    public recoveryCode: string,
  ) {}
}

@CommandHandler(NewPassportCommand)
export class NewPassportHandler
  implements ICommandHandler<NewPassportCommand, void>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}
  async execute(command: NewPassportCommand): Promise<void> {
    const { recoveryCode, newPassword } = command;

    const { userId, exp } = this.authService.verifyRecoveryCode(recoveryCode);

    if (!userId || !exp) {
      throw new BadRequestException({
        message: 'Recovery code not correct',
        key: 'recoveryCode',
      });
    }

    if (
      isExpiredDate({
        expirationDate: fromUnixTimeToISO(exp),
        currentDate: getCurrentDate(),
      })
    ) {
      throw new BadRequestException({
        message: 'Recovery code not correct',
        key: 'recoveryCode',
      });
    }

    const user = await this.usersRepository.get(userId);

    if (
      user?.recoveryCode?.isUsed ||
      user?.recoveryCode?.code !== recoveryCode
    ) {
      throw new BadRequestException({
        message: 'Recovery code not correct',
        key: 'recoveryCode',
      });
    }

    const passwordHash = await this.authService.generatePasswordHash(
      newPassword,
    );

    await this.usersRepository.update(
      userId,
      NewPasswordDtoMapper(passwordHash),
    );
  }
}
