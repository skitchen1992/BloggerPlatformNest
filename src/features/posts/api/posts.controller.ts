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
import { PostsService } from '@features/posts/application/posts.service';
import { PostsQueryRepository } from '@features/posts/infrastructure/posts.query-repository';
import { UpdatePostDto } from '@features/posts/api/dto/input/update-post.input.dto';
import { PostQuery } from '@features/posts/api/dto/output/post.output.pagination.dto';
import { CreateCommentDto } from '@features/comments/api/dto/input/create-comment.input.dto';
import { CommentsQueryRepository } from '@features/comments/infrastructure/comments.query-repository';
import { CommentQuery } from '@features/comments/api/dto/output/comment.output.pagination.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from '@features/posts/application/handlers/create-comment.handler';
import { ObjectId } from 'mongodb';
import { BlogsQueryRepository } from '@features/blogs/infrastructure/blogs.query-repository';
import { CreatePostCommand } from '@features/posts/application/handlers/create-post.handler';

// Tag для swagger
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Post(':postId/comments')
  async createComment(
    @Body() input: CreateCommentDto,
    @Param('postId') postId: string,
  ) {
    const post = await this.postsQueryRepository.getById(postId);

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

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

    return await this.commentsQueryRepository.getById(createdCommentId);
  }

  @Get(':postId/comments')
  async getAllComments(
    @Query() query: CommentQuery,
    @Param('postId') postId: string,
  ) {
    const post = await this.postsQueryRepository.getById(postId);

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return await this.commentsQueryRepository.getAll(query, { postId });
  }

  @Get()
  async getAll(@Query() query: PostQuery) {
    return await this.postsQueryRepository.getAll(query);
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
    //TODO: сделать middleware на валидность id
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

    const isUpdated: boolean = await this.postsService.update(
      id,
      title,
      shortDescription,
      content,
      blogId,
    );

    if (!isUpdated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const isDeleted: boolean = await this.postsService.delete(id);

    if (!isDeleted) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }
}
