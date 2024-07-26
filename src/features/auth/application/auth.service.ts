import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { User } from '@features/users/domain/user.entity';
import { HashBuilder } from '@utils/hash-builder';
import { UsersQueryRepository } from '@features/users/infrastructure/users.query-repository';
import { NodeMailer } from '@infrastructure/servises/nodemailer/nodemailer.service';
import {
  add,
  fromUnixTimeToISO,
  getCurrentDate,
  isExpiredDate,
} from '@utils/dates';
import { getUniqueId } from '@utils/utils';
import { JwtService } from '@infrastructure/servises/jwt/jwt.service';
import { appSettings } from '@settings/app-settings';
import { RecoveryCodeDtoMapper } from '@features/auth/api/dto/recovery-code.dto';
import { JwtPayload } from 'jsonwebtoken';
import { NewPasswordDtoMapper } from '@features/auth/api/dto/new-password.dto';
import {
  LoginOutputDto,
  LoginOutputDtoMapper,
} from '@features/auth/api/dto/output/login.output.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly hashBuilder: HashBuilder,
    protected readonly nodeMailer: NodeMailer,
    protected readonly jwtService: JwtService,
  ) {}

  public async registration(
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

  public async login(
    loginOrEmail: string,
    password: string,
  ): Promise<LoginOutputDto> {
    const { user } = await this.usersQueryRepository.findUserByLoginOrEmail(
      loginOrEmail,
      loginOrEmail,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const isCorrectPass = await this.hashBuilder.compare(
      password,
      user.password,
    );

    if (!isCorrectPass) {
      throw new UnauthorizedException();
    }

    return LoginOutputDtoMapper(this.getAccessToken(user._id.toString()));
  }

  public async recoveryPassword(email: string): Promise<void> {
    const { user } = await this.usersQueryRepository.findUserByLoginOrEmail(
      email,
      email,
    );

    if (!user) {
      const recoveryAccessToken = this.getAccessToken(null);
      await this.sendRecoveryPassEmail(email, recoveryAccessToken);
      return;
    }

    const userId = user._id.toString();

    const recoveryAccessToken = this.getAccessToken(userId);

    await this.usersRepository.update(
      userId,
      RecoveryCodeDtoMapper(recoveryAccessToken),
    );

    await this.sendRecoveryPassEmail(email, recoveryAccessToken);
  }

  public async newPassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<void> {
    const { userId, exp } =
      (this.jwtService.verifyToken(recoveryCode) as JwtPayload) ?? {};

    if (!userId || !exp) {
      throw new BadRequestException({
        message: 'Recovery code not correct',
        key: 'recoveryCode',
      });
    }

    if (isExpiredDate(fromUnixTimeToISO(exp), getCurrentDate())) {
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

    const passwordHash = await this.hashBuilder.hash(newPassword);

    await this.usersRepository.update(
      userId,
      NewPasswordDtoMapper(passwordHash),
    );
  }

  private getAccessToken(userId: string | null) {
    return this.jwtService.generateToken(
      { userId: userId },
      { expiresIn: appSettings.api.ACCESS_TOKEN_EXPIRED_IN },
    );
  }

  private async sendRegisterEmail(to: string, confirmationCode: string) {
    const link = `https://blogger-platform-bay.vercel.app/api/auth/registration-confirmation?code=${confirmationCode}`;
    const subject = 'Confirm your email address';
    const text = `Please confirm your email address by clicking the following link: link`;
    const html = `<p>Please confirm your email address by clicking the link below:</p><p><a href="${link}">Confirm Email</a></p>`;

    await this.nodeMailer.sendMail(to, subject, text, html);
  }

  private async sendRecoveryPassEmail(to: string, confirmationCode: string) {
    const link = `https://blogger-platform-bay.vercel.app/api/auth/password-recovery?recoveryCode=${confirmationCode}`;
    const subject = 'Password recovery';
    const text = `To finish password recovery please follow the link below: link`;
    const html = `<p>To finish password recovery please follow the link below:</p><p><a href="${link}">Password recovery</a></p>`;

    await this.nodeMailer.sendMail(to, subject, text, html);
  }
}
