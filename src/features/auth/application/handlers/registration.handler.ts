import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '@features/auth/application/auth.service';
import { add, getCurrentDate } from '@utils/dates';
import { getUniqueId } from '@utils/utils';
import { User } from '@features/users/domain/user.entity';

export class RegistrationCommand {
  constructor(
    public login: string,
    public password: string,
    public email: string,
  ) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationHandler
  implements ICommandHandler<RegistrationCommand, void>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}
  async execute(command: RegistrationCommand): Promise<void> {
    const { login, password, email } = command;
    const { foundBy } = await this.usersRepository.getUserByLoginOrEmail(
      login,
      email,
    );

    if (foundBy) {
      throw new BadRequestException({
        message: 'User already exists',
        key: foundBy,
      });
    }

    const passwordHash = await this.authService.generatePasswordHash(password);

    const confirmationCode = getUniqueId();

    const newUser: User = {
      login,
      password: passwordHash,
      email,
      createdAt: getCurrentDate(),
      emailConfirmation: {
        isConfirmed: false,
        confirmationCode,
        expirationDate: add(getCurrentDate(), { hours: 1 }),
      },
    };

    await this.usersRepository.create(newUser);

    await this.authService.sendRegisterEmail(email, confirmationCode);
  }
}
