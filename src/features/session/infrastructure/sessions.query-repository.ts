import { Injectable } from '@nestjs/common';
import { Session, SessionModelType } from '../domain/session.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SessionsQueryRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: SessionModelType,
  ) {}

  async deleteSessionByDeviceId(id: string): Promise<boolean> {
    const deleteResult = await this.sessionModel.deleteOne({ deviceId: id });
    return deleteResult.deletedCount === 1;
  }

  async deleteSessionList(): Promise<boolean> {
    const deleteResult = await this.sessionModel.deleteMany({});
    return deleteResult.deletedCount === 1;
  }
}
