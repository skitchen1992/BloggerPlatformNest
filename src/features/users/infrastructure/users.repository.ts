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

  public async getByField(
    field: string,
    value: string,
  ): Promise<UserDocument | null> {
    const query: Record<string, string> = {};
    query[field] = value;

    const user = await this.userModel.findOne(query).lean();

    if (!user) {
      return null;
    }

    return user;
  }
  public async updateUserFieldById(
    id: string,
    field: string,
    data: unknown,
  ): Promise<boolean> {
    const updateResult = await this.userModel.updateOne(
      { _id: id },
      { $set: { [field]: data } },
    );

    return updateResult.modifiedCount === 1;
  }

  public async isLoginExist(login: string): Promise<boolean> {
    const user = await this.userModel.countDocuments({ login: login });

    return !Boolean(user);
  }

  public async isEmailExist(email: string): Promise<boolean> {
    const user = await this.userModel.countDocuments({ email: email });

    return !Boolean(user);
  }
  public async isUserExist(login: string, email: string): Promise<boolean> {
    const user = await this.userModel
      .countDocuments({
        $or: [{ login }, { email }],
      })
      .lean();

    return Boolean(user);
  }

  public async getUserByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<{
    user: UserDocument | null;
    foundBy: string | null;
  }> {
    const user = await this.userModel
      .findOne({
        $or: [{ login }, { email }],
      })
      .lean();

    if (!user) {
      return { user: null, foundBy: null };
    }

    const foundBy = user.login === login ? 'login' : 'email';
    return { user, foundBy };
  }

  public async getUserByConfirmationCode(
    code: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel
      .findOne({
        'emailConfirmation.confirmationCode': code,
      })
      .lean();

    if (!user) {
      return null;
    }

    return user;
  }
}
