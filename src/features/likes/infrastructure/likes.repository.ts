import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Like,
  LikesDocument,
  LikesModelType,
  ParentTypeEnum,
} from '../domain/likes.entity';
import { UpdateQuery } from 'mongoose';

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) private likesModel: LikesModelType) {}

  public async create(like: Like): Promise<string> {
    const insertResult = await this.likesModel.insertMany([like]);

    return insertResult[0].id;
  }

  public async get(
    userId: string,
    commentId: string,
    parentType: ParentTypeEnum,
  ): Promise<LikesDocument | null> {
    try {
      const like = await this.likesModel
        .findOne({
          $and: [{ authorId: userId }, { parentId: commentId }, { parentType }],
        })
        .lean();

      if (!like) {
        return null;
      }
      return like;
    } catch (e) {
      return null;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const deleteResult = await this.likesModel.deleteOne({ _id: id });

      return deleteResult.deletedCount === 1;
    } catch (e) {
      return false;
    }
  }

  public async update(id: string, data: UpdateQuery<Like>): Promise<boolean> {
    try {
      const updatedResult = await this.likesModel.updateOne({ _id: id }, data);

      return updatedResult.matchedCount > 0;
    } catch (e) {
      return false;
    }
  }
}
