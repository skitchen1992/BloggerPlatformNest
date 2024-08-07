import { Injectable } from '@nestjs/common';
import { Post, PostModelType } from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostOutputDto,
  PostOutputDtoMapper,
} from '../api/dto/output/post.output.dto';
import { Pagination } from '@base/models/pagination.base.model';
import {
  PostOutputPaginationDto,
  PostOutputPaginationDtoMapper,
  PostQuery,
} from '@features/posts/api/dto/output/post.output.pagination.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: PostModelType,
    private readonly pagination: Pagination,
  ) {}

  public async getById(postId: string): Promise<PostOutputDto | null> {
    try {
      const post = await this.postModel.findById(postId).lean();

      if (!post) {
        return null;
      }

      return PostOutputDtoMapper(post);
    } catch (e) {
      return null;
    }
  }

  public async getAll(
    query: PostQuery,
    params?: { blogId?: string },
  ): Promise<PostOutputPaginationDto> {
    const pagination = this.pagination.getPosts(query, params);

    const users = await this.postModel
      .find(pagination.query)
      .sort(pagination.sort)
      .skip(pagination.skip)
      .limit(pagination.pageSize)
      .lean();

    const totalCount = await this.postModel.countDocuments(pagination.query);

    const postList = users.map((user) => PostOutputDtoMapper(user));

    return PostOutputPaginationDtoMapper(
      postList,
      totalCount,
      pagination.pageSize,
      pagination.page,
    );
  }
}
