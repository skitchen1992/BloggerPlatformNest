import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Post } from '@features/posts/domain/post.entity';
import { PostsRepository } from '@features/posts/infrastructure/posts.repository';

export class CreatePostCommand {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler
  implements ICommandHandler<CreatePostCommand, string>
{
  constructor(private readonly postsRepository: PostsRepository) {}
  async execute(command: CreatePostCommand): Promise<string> {
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
