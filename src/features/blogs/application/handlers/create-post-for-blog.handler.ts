import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Post } from '@features/posts/domain/post.entity';
import { PostsRepository } from '@features/posts/infrastructure/posts.repository';

export class CreatePostForBlogCommand {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
  ) {}
}

@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogHandler
  implements ICommandHandler<CreatePostForBlogCommand, string>
{
  constructor(private readonly postsRepository: PostsRepository) {}
  async execute(command: CreatePostForBlogCommand): Promise<string> {
    const { title, shortDescription, content, blogId, blogName } = command;

    const newPost: Post = {
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: new Date(),
    };

    return await this.postsRepository.create(newPost);
  }
}
