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
import { BlogCreateDto } from './dto/input/create-blog.input.dto';
import { BlogsService } from '../application/blogs.service';
import { UsersQuery } from '@features/users/api/dto/output/user.output.pagination.dto';
import { BlogUpdateDto } from '@features/blogs/api/dto/input/update-blog.input.dto';

// Tag для swagger
@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  async getAll(@Query() query: UsersQuery) {
    return await this.blogsQueryRepository.getAll(query);
  }

  @Post()
  async create(@Body() input: BlogCreateDto) {
    const { name, description, websiteUrl } = input;

    const createdBlogId: string = await this.blogsService.create(
      name,
      description,
      websiteUrl,
    );

    return await this.blogsQueryRepository.getById(createdBlogId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    //TODO: сделать middleware на валидность id
    const blog = await this.blogsQueryRepository.getById(id);

    if (blog) {
      return blog;
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() input: BlogUpdateDto) {
    const { name, description, websiteUrl } = input;

    const isUpdated: boolean = await this.blogsService.update(
      id,
      name,
      description,
      websiteUrl,
    );

    if (!isUpdated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
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
