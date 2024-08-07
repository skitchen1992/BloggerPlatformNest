import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/input/create-post.input.dto';
import { UpdatePostDto } from '@features/posts/api/dto/input/update-post.input.dto';
import {
  PostOutputPaginationDto,
  PostQuery,
} from '@features/posts/api/dto/output/post.output.pagination.dto';
import { CreateCommentDto } from '@features/comments/api/dto/input/create-comment.input.dto';
import {
  CommentOutputPaginationDto,
  CommentQuery,
} from '@features/comments/api/dto/output/comment.output.pagination.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from '@features/posts/application/handlers/create-comment.handler';
import { ObjectId } from 'mongodb';
import { CreatePostCommand } from '@features/posts/application/handlers/create-post.handler';
import { UpdatePostCommand } from '@features/posts/application/handlers/update-post.handler';
import { DeletePostCommand } from '@features/posts/application/handlers/delete-post.handler';
import { IsPostExistCommand } from '@features/posts/application/handlers/is-post-exist.handler';
import { GetCommentQuery } from '@features/posts/application/handlers/get-comment.handler';
import { CommentOutputDto } from '@features/comments/api/dto/output/comment.output.dto';
import { GetCommentsForPostQuery } from '@features/posts/application/handlers/get-comments-for-post.handler';
import { GetAllPostQuery } from '@features/posts/application/handlers/get-all-posts.handler';
import { PostOutputDto } from '@features/posts/api/dto/output/post.output.dto';
import { GetPostQuery } from '@features/posts/application/handlers/get-post.handler';
import { JwtAuthGuard } from '@infrastructure/guards/bearer-auth-guard.service';

// Tag для swagger
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiSecurity('bearer')
  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createComment(
    @Body() input: CreateCommentDto,
    @Param('postId') postId: string,
  ) {
    await this.commandBus.execute<IsPostExistCommand, string>(
      new IsPostExistCommand(postId),
    );

    const { content } = input;

    const createdCommentId: string = await this.commandBus.execute<
      CreateCommentCommand,
      string
    >(
      new CreateCommentCommand(
        content,
        new ObjectId().toString(),
        'login',
        postId,
      ),
    );

    return await this.queryBus.execute<GetCommentQuery, CommentOutputDto>(
      new GetCommentQuery(createdCommentId),
    );
  }

  @Get(':postId/comments')
  async getAllComments(
    @Query() query: CommentQuery,
    @Param('postId') postId: string,
  ) {
    await this.commandBus.execute<IsPostExistCommand, string>(
      new IsPostExistCommand(postId),
    );

    return await this.queryBus.execute<
      GetCommentsForPostQuery,
      CommentOutputPaginationDto
    >(new GetCommentsForPostQuery(postId, query));
  }

  @Get()
  async getAll(@Query() query: PostQuery) {
    return await this.queryBus.execute<
      GetAllPostQuery,
      PostOutputPaginationDto
    >(new GetAllPostQuery(query));
  }

  @ApiSecurity('bearer')
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() input: CreatePostDto) {
    const { title, shortDescription, content, blogId } = input;

    const createdPostId: string = await this.commandBus.execute<
      CreatePostCommand,
      string
    >(new CreatePostCommand(title, shortDescription, content, blogId));

    return await this.queryBus.execute<GetPostQuery, PostOutputDto>(
      new GetPostQuery(createdPostId),
    );
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return await this.queryBus.execute<GetPostQuery, PostOutputDto>(
      new GetPostQuery(id),
    );
  }

  @ApiSecurity('bearer')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() input: UpdatePostDto) {
    const { title, shortDescription, content, blogId } = input;

    await this.commandBus.execute<UpdatePostCommand, void>(
      new UpdatePostCommand(id, title, shortDescription, content, blogId),
    );
  }

  @ApiSecurity('bearer')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    await this.commandBus.execute<DeletePostCommand, void>(
      new DeletePostCommand(id),
    );
  }
}
