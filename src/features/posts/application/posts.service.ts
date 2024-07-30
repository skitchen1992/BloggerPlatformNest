import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '@features/posts/infrastructure/posts.repository';
import { UpdatePostDto } from '@features/posts/api/dto/input/update-post.input.dto';
import { Post } from '@features/posts/domain/post.entity';
import { BlogsQueryRepository } from '@features/blogs/infrastructure/blogs.query-repository';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async create(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<string> {
    const blog = await this.blogsQueryRepository.getById(blogId);

    if (!blog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }

    const newPost: Post = {
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };

    return await this.postsRepository.create(newPost);
  }

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
