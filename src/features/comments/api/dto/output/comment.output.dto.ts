import { CommentDocument } from '../../../domain/comment.entity';

export enum LikeStatus {
  LIKE = 'Like',
  DISLIKE = 'Dislike',
  NONE = 'None',
}
export interface ILikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
export class CommentOutputDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  postId: string;
  createdAt: string;
  likesInfo: ILikesInfo;
}

// MAPPERS

export const CommentOutputDtoMapper = (
  comment: CommentDocument,
): CommentOutputDto => {
  const outputDto = new CommentOutputDto();

  outputDto.id = comment._id.toString();
  outputDto.content = comment.content;
  outputDto.commentatorInfo = {
    userId: comment.commentatorInfo.userId,
    userLogin: comment.commentatorInfo.userLogin,
  };
  outputDto.createdAt = comment.createdAt.toISOString();
  outputDto.likesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: LikeStatus.NONE,
  };

  return outputDto;
};
