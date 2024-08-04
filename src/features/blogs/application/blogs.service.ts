import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '@features/blogs/infrastructure/blogs.repository';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async delete(id: string): Promise<boolean> {
    return await this.blogsRepository.delete(id);
  }
}
