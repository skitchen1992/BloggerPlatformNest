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
import { PostCreateDto } from './dto/input/create-post.input.dto';
import { PostsService } from '@features/posts/application/posts.service';
import { PostsQueryRepository } from '@features/posts/infrastructure/posts.query-repository';
import { PostUpdateDto } from '@features/posts/api/dto/input/update-post.input.dto';
import { PostQuery } from '@features/posts/api/dto/output/post.output.pagination.dto';
import { CommentCreateDto } from '@features/comments/api/dto/input/create-comment.input.dto';
import { CommentsService } from '@features/comments/application/comments.service';
import { CommentsQueryRepository } from '@features/comments/infrastructure/comments.query-repository';
import { ObjectId } from 'mongodb';
import { CommentQuery } from '@features/comments/api/dto/output/comment.output.pagination.dto';

// Tag для swagger
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Post(':postId/comments')
  async createComment(
    @Body() input: CommentCreateDto,
    @Param('postId') postId: string,
  ) {
    const { content } = input;

    const createdCommentId: string = await this.commentsService.create(
      content,
      { userId: new ObjectId().toString(), userLogin: 'login' },
      postId,
    );

    return await this.commentsQueryRepository.getById(createdCommentId);
  }

  @Get(':postId/comments')
  async getAllComments(
    @Query() query: CommentQuery,
    @Param('postId') postId: string,
  ) {
    return await this.commentsQueryRepository.getAll(query, { postId });
  }

  @Get()
  async getAll(@Query() query: PostQuery) {
    return await this.postsQueryRepository.getAll(query);
  }

  @Post()
  async create(@Body() input: PostCreateDto) {
    const { title, shortDescription, content, blogId } = input;

    const createdPostId: string = await this.postsService.create(
      title,
      shortDescription,
      content,
      blogId,
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
  async update(@Param('id') id: string, @Body() input: PostUpdateDto) {
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
