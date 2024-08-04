import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { CommentsService } from '@features/comments/application/comments.service';
import { CommentsQueryRepository } from '@features/comments/infrastructure/comments.query-repository';
import { UpdateCommentDto } from '@features/comments/api/dto/input/update-comment.input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '@features/comments/application/handlers/update-comment.handler';

// Tag для swagger
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    const comment = await this.commentsQueryRepository.getById(id);

    if (comment) {
      return comment;
    } else {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() input: UpdateCommentDto) {
    const { content } = input;

    await this.commandBus.execute<UpdateCommentCommand, void>(
      new UpdateCommentCommand(content, id),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const isDeleted: boolean = await this.commentsService.delete(id);

    if (!isDeleted) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
  }
}
