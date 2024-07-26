import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { UpdateQuery } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  public async get(userId: string): Promise<UserDocument | null> {
    const user = await this.userModel.findById(userId).lean();

    if (!user) {
      return null;
    }

    return user;
  }

  public async create(newUser: User): Promise<string> {
    const insertResult = await this.userModel.insertMany([newUser]);

    return insertResult[0].id;
  }

  public async delete(id: string): Promise<boolean> {
    const deleteResult = await this.userModel.deleteOne({ _id: id });

    return deleteResult.deletedCount === 1;
  }

  public async update(id: string, data: UpdateQuery<User>): Promise<boolean> {
    const updatedResult = await this.userModel.updateOne({ _id: id }, data);

    return updatedResult.modifiedCount === 1;
  }
}
