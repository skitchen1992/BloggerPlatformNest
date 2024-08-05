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
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreatePostDto } from './dto/input/create-post.input.dto';
import { PostsQueryRepository } from '@features/posts/infrastructure/posts.query-repository';
import { UpdatePostDto } from '@features/posts/api/dto/input/update-post.input.dto';
import {
  PostOutputPaginationDto,
  PostQuery,
} from '@features/posts/api/dto/output/post.output.pagination.dto';
import { CreateCommentDto } from '@features/comments/api/dto/input/create-comment.input.dto';
import { CommentsQueryRepository } from '@features/comments/infrastructure/comments.query-repository';
import {
  CommentOutputPaginationDto,
  CommentQuery,
} from '@features/comments/api/dto/output/comment.output.pagination.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from '@features/posts/application/handlers/create-comment.handler';
import { ObjectId } from 'mongodb';
import { BlogsQueryRepository } from '@features/blogs/infrastructure/blogs.query-repository';
import { CreatePostCommand } from '@features/posts/application/handlers/create-post.handler';
import { UpdatePostCommand } from '@features/posts/application/handlers/update-post.handler';
import { DeletePostCommand } from '@features/posts/application/handlers/delete-post.handler';
import { IsPostExistCommand } from '@features/posts/application/handlers/is-post-exist.handler';
import { GetCommentQuery } from '@features/posts/application/handlers/get-comment.handler';
import { CommentOutputDto } from '@features/comments/api/dto/output/comment.output.dto';
import { GetCommentsForPostQuery } from '@features/posts/application/handlers/get-comments-for-post.handler';
import { GetAllPostQuery } from '@features/posts/application/handlers/get-all-posts.handler';

// Tag для swagger
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

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

  @Post()
  async create(@Body() input: CreatePostDto) {
    const { title, shortDescription, content, blogId } = input;

    const blog = await this.blogsQueryRepository.getById(blogId);

    if (!blog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }

    const createdPostId: string = await this.commandBus.execute<
      CreatePostCommand,
      string
    >(
      new CreatePostCommand(
        title,
        shortDescription,
        content,
        blogId,
        blog.name,
      ),
    );

    return await this.postsQueryRepository.getById(createdPostId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const blog = await this.postsQueryRepository.getById(id);

    if (blog) {
      return blog;
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() input: UpdatePostDto) {
    const { title, shortDescription, content, blogId } = input;

    await this.commandBus.execute<UpdatePostCommand, void>(
      new UpdatePostCommand(id, title, shortDescription, content, blogId),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.commandBus.execute<DeletePostCommand, void>(
      new DeletePostCommand(id),
    );
  }
}
