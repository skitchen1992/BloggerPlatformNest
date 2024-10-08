import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Request, Response } from 'express';
import { COOKIE_KEY } from '@utils/consts';
import { CookieService } from '@infrastructure/servises/cookie/cookie.service';
import { UnauthorizedException } from '@nestjs/common';
import { SessionsRepository } from '@features/session/infrastructure/sessions.repository';
import { Session } from '@features/session/domain/session.entity';
import { SharedService } from '@infrastructure/servises/shared/shared.service';

export class DeleteAllDevicesCommand {
  constructor(
    public res: Response,
    public req: Request,
  ) {}
}

@CommandHandler(DeleteAllDevicesCommand)
export class DeleteAllDevicesHandler
  implements ICommandHandler<DeleteAllDevicesCommand, void>
{
  constructor(
    protected readonly cookieService: CookieService,
    protected readonly sessionsRepository: SessionsRepository,
    protected readonly sharedService: SharedService,
  ) {}
  async execute(command: DeleteAllDevicesCommand): Promise<void> {
    const { req } = command;

    const refreshToken = this.cookieService.getCookie(
      req,
      COOKIE_KEY.REFRESH_TOKEN,
    );
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const { deviceId } = this.sharedService.verifyRefreshToken(refreshToken);

    if (!deviceId) {
      throw new UnauthorizedException();
    }

    const session = await this.sessionsRepository.getSessionByDeviceId(
      deviceId,
    );

    if (!session) {
      throw new UnauthorizedException();
    }

    await this.sessionsRepository.deleteList();

    const newSession: Session = {
      userId: session.userId,
      ip: session.ip,
      title: session.title,
      lastActiveDate: session.lastActiveDate,
      tokenIssueDate: session.tokenIssueDate,
      tokenExpirationDate: session.tokenExpirationDate,
      deviceId: session.deviceId,
    };

    await this.sessionsRepository.create(newSession);
  }
}
