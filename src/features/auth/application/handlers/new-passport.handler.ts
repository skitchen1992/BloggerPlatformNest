import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import {
  fromUnixTimeToISO,
  getCurrentISOStringDate,
  isExpiredDate,
} from '@utils/dates';
import { NewPasswordDtoMapper } from '@features/auth/api/dto/new-password.dto';
import { SharedService } from '@infrastructure/servises/shared/shared.service';

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
    private readonly sharedService: SharedService,
  ) {}
  async execute(command: NewPassportCommand): Promise<void> {
    const { recoveryCode, newPassword } = command;

    const { userId, exp } = this.sharedService.verifyRecoveryCode(recoveryCode);

    if (!userId || !exp) {
      throw new BadRequestException({
        message: 'Recovery code not correct',
        key: 'recoveryCode',
      });
    }

    if (
      isExpiredDate({
        expirationDate: fromUnixTimeToISO(exp),
        currentDate: getCurrentISOStringDate(),
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

    const passwordHash = await this.sharedService.generatePasswordHash(
      newPassword,
    );

    await this.usersRepository.update(
      userId,
      NewPasswordDtoMapper(passwordHash),
    );
  }
}
