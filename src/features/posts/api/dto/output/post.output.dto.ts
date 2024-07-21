import { PostDocument } from '../../../domain/post.entity';

export enum LikeStatus {
  LIKE = 'Like',
  DISLIKE = 'Dislike',
  NONE = 'None',
}

export type NewestLike = {
  addedAt: string;
  userId: string;
  login: string;
};

export type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewestLike[];
};
export class PostOutputDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfo;
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
  outputDto.extendedLikesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: LikeStatus.NONE,
    newestLikes: [],
  };

  return outputDto;
};
