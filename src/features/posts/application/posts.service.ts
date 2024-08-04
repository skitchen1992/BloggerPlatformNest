import { Injectable } from '@nestjs/common';
import { PostsRepository } from '@features/posts/infrastructure/posts.repository';
import { UpdatePostDto } from '@features/posts/api/dto/input/update-post.input.dto';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async update(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean> {
    const data: UpdatePostDto = {
      title,
      shortDescription,
      content,
      blogId,
    };

    return await this.postsRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.postsRepository.delete(id);
  }
}
