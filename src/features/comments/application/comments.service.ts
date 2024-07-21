import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '@features/comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from '@features/comments/infrastructure/comments.query-repository';
import {
  Comment,
  ICommentatorInfo,
} from '@features/comments/domain/comment.entity';
import { PostsQueryRepository } from '@features/posts/infrastructure/posts.query-repository';
import { CommentUpdateDto } from '@features/comments/api/dto/input/update-comment.input.dto';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
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

  async update(id: string, content: string): Promise<boolean> {
    const data: CommentUpdateDto = {
      content,
    };

    return await this.commentsRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.commentsRepository.delete(id);
  }
}
