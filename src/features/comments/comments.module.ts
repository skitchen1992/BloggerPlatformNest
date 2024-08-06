import { forwardRef, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '@features/users/api/users.controller';
import { SharedModule } from '../../modules/shared.module';
import { BlogsModule } from '@features/blogs/blogs.module';
import { CommentsRepository } from '@features/comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from '@features/comments/infrastructure/comments.query-repository';
import { CommentsService } from '@features/comments/application/comments.service';
import { UpdateCommentHandler } from '@features/comments/application/handlers/update-comment.handler';
import { DeleteCommentHandler } from '@features/comments/application/handlers/delete-comment.handler';
import { CreateCommentHandler } from '@features/posts/application/handlers/create-comment.handler';
import { GetCommentHandler } from '@features/comments/application/handlers/get-comment.handler';
import {
  Comment,
  CommentSchema,
} from '@features/comments/domain/comment.entity';

const commentsProviders: Provider[] = [
  CommentsRepository,
  CommentsQueryRepository,
  CommentsService,
  UpdateCommentHandler,
  DeleteCommentHandler,
  CreateCommentHandler,
  GetCommentHandler,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    SharedModule,
    forwardRef(() => BlogsModule),
  ],
  providers: [...commentsProviders],
  controllers: [UsersController],
  exports: [CommentsRepository, CommentsQueryRepository],
})
export class CommentsModule {}
