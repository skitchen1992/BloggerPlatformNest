import { Injectable } from '@nestjs/common';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentOutputDto,
  CommentOutputDtoMapper,
} from '../api/dto/output/comment.output.dto';
import { Pagination } from '@base/models/pagination.base.model';
import {
  CommentOutputPaginationDto,
  CommentOutputPaginationDtoMapper,
  CommentQuery,
} from '@features/comments/api/dto/output/comment.output.pagination.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
    private readonly pagination: Pagination,
  ) {}

  public async getById(id: string): Promise<CommentOutputDto | null> {
    const comment = await this.commentModel.findById(id).lean();

    if (!comment) {
      return null;
    }

    return CommentOutputDtoMapper(comment);
  }

  public async getAll(
    query: CommentQuery,
    params?: { postId: string },
  ): Promise<CommentOutputPaginationDto> {
    const pagination = this.pagination.getComments(query, params);

    const users = await this.commentModel
      .find(pagination.query)
      .sort(pagination.sort)
      .skip(pagination.skip)
      .limit(pagination.pageSize)
      .lean();

    const totalCount = await this.commentModel.countDocuments(pagination.query);

    const postList = users.map((user) => CommentOutputDtoMapper(user));

    return CommentOutputPaginationDtoMapper(
      postList,
      totalCount,
      pagination.pageSize,
      pagination.page,
    );
  }
}
