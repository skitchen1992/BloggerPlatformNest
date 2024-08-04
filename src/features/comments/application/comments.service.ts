import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '@features/comments/infrastructure/comments.repository';
import {
  Comment,
  ICommentatorInfo,
} from '@features/comments/domain/comment.entity';
import { PostsQueryRepository } from '@features/posts/infrastructure/posts.query-repository';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async create(
    content: string,
    commentatorInfo: ICommentatorInfo,
    postId: string,
  ): Promise<string> {
    const post = await this.postsQueryRepository.getById(postId);

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    const newComment: Comment = {
      content,
      commentatorInfo,
      postId,
      createdAt: new Date(),
    };

    return await this.commentsRepository.create(newComment);
  }

  async delete(id: string): Promise<boolean> {
    return await this.commentsRepository.delete(id);
  }
}
