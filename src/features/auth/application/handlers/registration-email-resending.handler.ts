import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '@features/auth/application/auth.service';
import { getCurrentDate, isExpiredDate } from '@utils/dates';
import { getUniqueId } from '@utils/utils';

export class RegistrationEmailResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingHandler
  implements ICommandHandler<RegistrationEmailResendingCommand, void>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}
  async execute(command: RegistrationEmailResendingCommand): Promise<void> {
    const { email } = command;

    const { user } = await this.usersRepository.getUserByLoginOrEmail(
      email,
      email,
    );

    if (!user) {
      throw new BadRequestException({
        message: 'Email not found',
        key: 'email',
      });
    }

    if (user.emailConfirmation?.isConfirmed) {
      throw new BadRequestException({
        message: 'Email already confirmed',
        key: 'email',
      });
    }

    if (
      user.emailConfirmation?.expirationDate &&
      isExpiredDate({
        expirationDate: user.emailConfirmation.expirationDate.toString(),
        currentDate: getCurrentDate(),
      })
    ) {
      throw new BadRequestException({
        message: 'Confirmation code expired',
        key: 'code',
      });
    }

    const confirmationCode = getUniqueId();

    await this.usersRepository.updateUserFieldById(
      user._id.toString(),
      'emailConfirmation.confirmationCode',
      confirmationCode,
    );

    await this.authService.sendRegisterEmail(email, confirmationCode);
  }
}
