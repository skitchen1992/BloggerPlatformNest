import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '@features/blogs/infrastructure/blogs.repository';
import { Blog } from '@features/blogs/domain/blog.entity';
import { BlogUpdateDto } from '@features/blogs/api/dto/input/update-blog.input.dto';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async create(
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<string> {
    const newBlog: Blog = {
      name,
      description,
      websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };

    return await this.blogsRepository.create(newBlog);
  }

  async update(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    const data: BlogUpdateDto = {
      name,
      description,
      websiteUrl,
    };

    return await this.blogsRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.blogsRepository.delete(id);
  }
}
