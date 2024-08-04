import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '@features/blogs/infrastructure/blogs.repository';
import { UpdateBlogDto } from '@features/blogs/api/dto/input/update-blog.input.dto';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async update(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    const data: UpdateBlogDto = {
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
