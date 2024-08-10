import { forwardRef, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '../../modules/shared.module';
import { CommentsRepository } from '@features/comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from '@features/comments/infrastructure/comments.query-repository';
import { CommentsService } from '@features/comments/application/comments.service';
import { UpdateCommentHandler } from '@features/comments/application/handlers/update-comment.handler';
import { DeleteCommentHandler } from '@features/comments/application/handlers/delete-comment.handler';
import { CreateCommentHandler } from '@features/comments/application/handlers/create-comment.handler';
import { GetCommentHandler } from '@features/comments/application/handlers/get-comment.handler';
import {
  Comment,
  CommentSchema,
} from '@features/comments/domain/comment.entity';
import { IsCommentExistHandler } from '@features/comments/application/handlers/is-comment-exist.handler';
import { CommentsController } from '@features/comments/api/comments.controller';
import { Like, LikeSchema } from '@features/likes/domain/likes.entity';
import { UsersModule } from '@features/users/users.module';

const commentsProviders: Provider[] = [
  CommentsRepository,
  CommentsQueryRepository,
  CommentsService,
  UpdateCommentHandler,
  DeleteCommentHandler,
  CreateCommentHandler,
  GetCommentHandler,
  IsCommentExistHandler,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    SharedModule,
    forwardRef(() => UsersModule),
  ],
  providers: [...commentsProviders],
  controllers: [CommentsController],
  exports: [CommentsRepository, CommentsQueryRepository],
})
export class CommentsModule {}
