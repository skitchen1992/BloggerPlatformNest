import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Blog } from '@features/blogs/domain/blog.entity';
import { BlogsRepository } from '@features/blogs/infrastructure/blogs.repository';
import { getCurrentDate } from '@utils/dates';

export class CreateBlogCommand {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler
  implements ICommandHandler<CreateBlogCommand, string>
{
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async execute(command: CreateBlogCommand): Promise<string> {
    const { name, description, websiteUrl } = command;

    const newBlog: Blog = {
      name,
      description,
      websiteUrl,
      createdAt: getCurrentDate(),
      isMembership: false,
    };

    return await this.blogsRepository.create(newBlog);
  }
}
