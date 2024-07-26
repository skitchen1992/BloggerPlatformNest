import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModelType } from '../domain/session.entity';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: SessionModelType,
  ) {}

  public async create(newSession: Session): Promise<string> {
    const insertResult = await this.sessionModel.insertMany([newSession]);

    return insertResult[0].id;
  }

  public async delete(id: string): Promise<boolean> {
    const deleteResult = await this.sessionModel.deleteOne({ _id: id });

    return deleteResult.deletedCount === 1;
  }

  public async update(id: string, data: Session): Promise<boolean> {
    const updatedResult = await this.sessionModel.updateOne({ _id: id }, data);

    return updatedResult.matchedCount > 0;
  }
}
