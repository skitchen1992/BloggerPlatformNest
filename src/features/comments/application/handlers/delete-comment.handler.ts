import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '@features/comments/infrastructure/comments.repository';
import { NotFoundException } from '@nestjs/common';

export class DeleteCommentCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand, void>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async execute(command: DeleteCommentCommand): Promise<void> {
    const { id } = command;

    try {
      const isDeleted: boolean = await this.commentsRepository.delete(id);

      if (!isDeleted) {
        throw new NotFoundException(`Comment with id ${id} not found`);
      }
    } catch (e) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
  }
}
