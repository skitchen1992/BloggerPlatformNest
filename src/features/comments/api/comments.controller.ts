import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UpdateCommentDto } from '@features/comments/api/dto/input/update-comment.input.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '@features/comments/application/handlers/update-comment.handler';
import { DeleteCommentCommand } from '@features/comments/application/handlers/delete-comment.handler';
import { GetCommentQuery } from '@features/comments/application/handlers/get-comment.handler';
import { CommentOutputDto } from '@features/comments/api/dto/output/comment.output.dto';
import { JwtAuthGuard } from '@infrastructure/guards/bearer-auth-guard.service';

// Tag для swagger
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.queryBus.execute<GetCommentQuery, CommentOutputDto>(
      new GetCommentQuery(id),
    );
  }

  @ApiSecurity('bearer')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() input: UpdateCommentDto) {
    const { content } = input;

    await this.commandBus.execute<UpdateCommentCommand, void>(
      new UpdateCommentCommand(content, id),
    );
  }

  @ApiSecurity('bearer')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.commandBus.execute<DeleteCommentCommand, void>(
      new DeleteCommentCommand(id),
    );
  }
}
