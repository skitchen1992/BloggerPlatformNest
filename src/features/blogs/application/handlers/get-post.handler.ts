import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '@features/posts/infrastructure/posts.query-repository';
import { PostOutputDto } from '@features/posts/api/dto/output/post.output.dto';
import { NotFoundException } from '@nestjs/common';

export class GetPostQuery {
  constructor(public postId: string) {}
}

@QueryHandler(GetPostQuery)
export class GetPostHandler
  implements IQueryHandler<GetPostQuery, PostOutputDto>
{
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}
  async execute(command: GetPostQuery): Promise<PostOutputDto> {
    const { postId } = command;

    const post = await this.postsQueryRepository.getById(postId);

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    return post;
  }
}
