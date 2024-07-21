import { CommentDocument } from '../../../domain/comment.entity';

export class CommentOutputDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  postId: string;
  createdAt: string;
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

  return outputDto;
};
