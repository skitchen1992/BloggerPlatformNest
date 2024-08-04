import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '@features/blogs/infrastructure/blogs.query-repository';
import { UsersQuery } from '@features/users/api/dto/output/user.output.pagination.dto';
import { BlogOutputPaginationDto } from '@features/blogs/api/dto/output/blog.output.pagination.dto';

export class GetAllCommand {
  constructor(public query: UsersQuery) {}
}

@CommandHandler(GetAllCommand)
export class GetAllHandler
  implements ICommandHandler<GetAllCommand, BlogOutputPaginationDto>
{
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}
  async execute(command: GetAllCommand): Promise<BlogOutputPaginationDto> {
    const { query } = command;

    return await this.blogsQueryRepository.getAll(query);
  }
}
