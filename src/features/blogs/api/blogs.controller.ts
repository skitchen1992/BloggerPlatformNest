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
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { CreateBlogDto } from './dto/input/create-blog.input.dto';
import { BlogsService } from '../application/blogs.service';
import { UsersQuery } from '@features/users/api/dto/output/user.output.pagination.dto';
import { UpdateBlogDto } from '@features/blogs/api/dto/input/update-blog.input.dto';
import { PostsQueryRepository } from '@features/posts/infrastructure/posts.query-repository';
import { PostQuery } from '@features/posts/api/dto/output/post.output.pagination.dto';
import { CreatePostForBlogDto } from '@features/blogs/api/dto/input/create-post-for-blog.input.dto';
import { PostsService } from '@features/posts/application/posts.service';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '@features/blogs/application/handlers/create-blog.handler';
import { CreatePostForBlogCommand } from '@features/blogs/application/handlers/create-post-for-blog.handler';
import { UpdateBlogCommand } from '@features/blogs/application/handlers/update-blog.handler';

// Tag для swagger
@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  async getAll(@Query() query: UsersQuery) {
    return await this.blogsQueryRepository.getAll(query);
  }

  @Post()
  async create(@Body() input: CreateBlogDto) {
    const { name, description, websiteUrl } = input;

    const createdBlogId: string = await this.commandBus.execute<
      CreateBlogCommand,
      string
    >(new CreateBlogCommand(name, description, websiteUrl));

    return await this.blogsQueryRepository.getById(createdBlogId);
  }

  @Get(':blogId/posts')
  async getPostsForBlog(
    @Param('blogId') blogId: string,
    @Query() query: PostQuery,
  ) {
    const blog = await this.blogsQueryRepository.getById(blogId);

    if (!blog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }
    return await this.postsQueryRepository.getAll(query, { blogId });
  }

  @Post(':blogId/posts')
  async createPostForBlog(
    @Param('blogId') blogId: string,
    @Body() input: CreatePostForBlogDto,
  ) {
    const blog = await this.blogsQueryRepository.getById(blogId);

    if (!blog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }

    const { title, shortDescription, content } = input;

    const createdPostId: string = await this.commandBus.execute<
      CreatePostForBlogCommand,
      string
    >(
      new CreatePostForBlogCommand(
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
    const blog = await this.blogsQueryRepository.getById(id);

    if (blog) {
      return blog;
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() input: UpdateBlogDto) {
    const { name, description, websiteUrl } = input;

    await this.commandBus.execute<UpdateBlogCommand, void>(
      new UpdateBlogCommand(id, name, description, websiteUrl),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const isDeleted: boolean = await this.blogsService.delete(id);

    if (!isDeleted) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
  }
}
