import { Injectable } from '@nestjs/common';
import { Session, SessionModelType } from '../domain/session.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SessionsQueryRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: SessionModelType,
  ) {}
}
