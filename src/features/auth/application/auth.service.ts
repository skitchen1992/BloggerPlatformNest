import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { User } from '@features/users/domain/user.entity';
import { HashBuilder } from '@utils/hash.builder';
import { UsersQueryRepository } from '@features/users/infrastructure/users.query-repository';
import { NodeMailer } from '@infrastructure/servises/nodemailer.service';
import { add } from '@utils/dates';
import { getUniqueId } from '@utils/utils';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly hashBuilder: HashBuilder,
    protected nodeMailer: NodeMailer,
  ) {}

  async registration(
    login: string,
    password: string,
    email: string,
  ): Promise<void> {
    const { user, foundBy } =
      await this.usersQueryRepository.findUserByLoginOrEmail(login, email);

    if (user) {
      throw new BadRequestException({
        message: 'User already exists',
        key: foundBy,
      });
    }

    const passwordHash = await this.hashBuilder.hash(password);

    const confirmationCode = getUniqueId();

    const newUser: User = {
      login,
      password: passwordHash,
      email,
      createdAt: new Date(),
      emailConfirmation: {
        isConfirmed: false,
        confirmationCode,
        expirationDate: add(new Date(), { hours: 1 }),
      },
    };

    await this.usersRepository.create(newUser);

    await this.sendRegisterEmail(email, confirmationCode);
  }

  async sendRegisterEmail(to: string, confirmationCode: string) {
    const link = `https://blogger-platform-bay.vercel.app/api/auth/registration-confirmation?code=${confirmationCode}`;
    const subject = 'Confirm your email address';
    const text = `Please confirm your email address by clicking the following link: link`;
    const html = `<p>Please confirm your email address by clicking the link below:</p><p><a href="${link}">Confirm Email</a></p>`;

    await this.nodeMailer.sendMail(to, subject, text, html);
  }

  async sendRecoveryPassEmail(to: string, confirmationCode: string) {
    const link = `https://blogger-platform-bay.vercel.app/api/auth/password-recovery?recoveryCode=${confirmationCode}`;
    const subject = 'Password recovery';
    const text = `To finish password recovery please follow the link below: link`;
    const html = `<p>To finish password recovery please follow the link below:</p><p><a href="${link}">Password recovery</a></p>`;

    await this.nodeMailer.sendMail(to, subject, text, html);
  }
}
