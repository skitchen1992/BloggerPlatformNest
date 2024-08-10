import { Trim } from '@infrastructure/decorators/transform/trim';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LikeStatusEnum } from '@features/likes/domain/likes.entity';

export class LikeDto {
  @Trim()
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @IsEnum(LikeStatusEnum, {
    message: 'LikeStatus must be one of the following: None, Like, Dislike',
  })
  likeStatus: LikeStatusEnum;
}
