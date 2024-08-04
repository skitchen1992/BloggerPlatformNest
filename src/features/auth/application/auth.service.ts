import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { HashBuilder } from '@utils/hash-builder';
import { NodeMailer } from '@infrastructure/servises/nodemailer/nodemailer.service';
import { getCurrentDate, isExpiredDate } from '@utils/dates';
import { getUniqueId } from '@utils/utils';
import { JwtPayload } from 'jsonwebtoken';
import {
  MeOutputDto,
  MeOutputDtoMapper,
} from '@features/auth/api/dto/output/me.output.dto';
import { UserOutputDto } from '@features/users/api/dto/output/user.output.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashBuilder: HashBuilder,
    protected readonly nodeMailer: NodeMailer,
    protected readonly jwtService: JwtService,
  ) {}

  public async isCorrectPass(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return this.hashBuilder.compare(password, userPassword);
  }

  public verifyRecoveryCode(recoveryCode: string) {
    try {
      const { userId, exp } =
        (this.jwtService.verify(recoveryCode) as JwtPayload) ?? {};

      return { userId, exp };
    } catch (e) {
      throw new BadRequestException({
        message: 'Recovery code not correct',
        key: 'recoveryCode',
      });
    }
  }

  async generatePasswordHash(password: string): Promise<string> {
    return await this.hashBuilder.hash(password);
  }

  public async me(user: UserOutputDto): Promise<MeOutputDto> {
    return MeOutputDtoMapper(user);
  }

  public async getAccessToken(userId: string | null) {
    return await this.jwtService.signAsync({ userId: userId });
  }

  public async sendRegisterEmail(to: string, confirmationCode: string) {
    const link = `https://blogger-platform-bay.vercel.app/api/auth/registration-confirmation?code=${confirmationCode}`;
    const subject = 'Confirm your email address';
    const text = `Please confirm your email address by clicking the following link: link`;
    const html = `<p>Please confirm your email address by clicking the link below:</p><p><a href="${link}">Confirm Email</a></p>`;

    this.nodeMailer.sendMail(to, subject, text, html);
  }

  public async sendRecoveryPassEmail(to: string, confirmationCode: string) {
    const link = `https://blogger-platform-bay.vercel.app/api/auth/password-recovery?recoveryCode=${confirmationCode}`;
    const subject = 'Password recovery';
    const text = `To finish password recovery please follow the link below: link`;
    const html = `<p>To finish password recovery please follow the link below:</p><p><a href="${link}">Password recovery</a></p>`;

    this.nodeMailer.sendMail(to, subject, text, html);
  }
}
