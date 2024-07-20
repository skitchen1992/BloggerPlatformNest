import { PostDocument } from '../../../domain/post.entity';

export class PostOutputDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

// MAPPERS

export const PostOutputDtoMapper = (post: PostDocument): PostOutputDto => {
  const outputDto = new PostOutputDto();

  outputDto.id = post._id.toString();
  outputDto.title = post.title;
  outputDto.shortDescription = post.shortDescription;
  outputDto.content = post.content;
  outputDto.blogId = post.blogId;
  outputDto.blogName = post.blogName;
  outputDto.createdAt = post.createdAt.toISOString();

  return outputDto;
};
