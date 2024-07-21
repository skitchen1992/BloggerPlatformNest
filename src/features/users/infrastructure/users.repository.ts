import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../domain/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  public async create(newUser: User): Promise<string> {
    const insertResult = await this.userModel.insertMany([newUser]);

    return insertResult[0].id;
  }

  public async delete(id: string): Promise<boolean> {
    const deleteResult = await this.userModel.deleteOne({ _id: id });

    return deleteResult.deletedCount === 1;
  }
}
