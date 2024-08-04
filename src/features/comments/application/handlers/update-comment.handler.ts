import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '@features/comments/infrastructure/comments.repository';
import { UpdateCommentDto } from '@features/comments/api/dto/input/update-comment.input.dto';
import { NotFoundException } from '@nestjs/common';

export class UpdateCommentCommand {
  constructor(
    public content: string,
    public id: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand, void>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async execute(command: UpdateCommentCommand): Promise<void> {
    const { content, id } = command;

    try {
      const data: UpdateCommentDto = {
        content,
      };

      const isUpdated: boolean = await this.commentsRepository.update(id, data);

      if (!isUpdated) {
        throw new NotFoundException(`Comment with id ${id} not found`);
      }
    } catch (e) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
  }
}
