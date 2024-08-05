import { CommandHandler, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '@features/comments/infrastructure/comments.query-repository';
import {
  CommentOutputPaginationDto,
  CommentQuery,
} from '@features/comments/api/dto/output/comment.output.pagination.dto';

export class GetCommentsForPostQuery {
  constructor(
    public postId: string,
    public query: CommentQuery,
  ) {}
}

@QueryHandler(GetCommentsForPostQuery)
export class GetCommentsForPostHandler
  implements IQueryHandler<GetCommentsForPostQuery, CommentOutputPaginationDto>
{
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async execute(
    command: GetCommentsForPostQuery,
  ): Promise<CommentOutputPaginationDto> {
    const { postId, query } = command;
    console.log('test', postId, query);
    return await this.commentsQueryRepository.getAll(query, { postId });
  }
}
