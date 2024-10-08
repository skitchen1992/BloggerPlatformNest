import { forwardRef, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '../../modules/shared.module';
import { PostsRepository } from '@features/posts/infrastructure/posts.repository';
import { PostsService } from '@features/posts/application/posts.service';
import { PostsQueryRepository } from '@features/posts/infrastructure/posts.query-repository';
import { CreatePostHandler } from '@features/posts/application/handlers/create-post.handler';
import { UpdatePostHandler } from '@features/posts/application/handlers/update-post.handler';
import { DeletePostHandler } from '@features/posts/application/handlers/delete-post.handler';
import { IsPostExistHandler } from '@features/posts/application/handlers/is-post-exist.handler';
import { IsBlogExistCommand } from '@features/posts/application/handlers/is-blog-exist.handler';
import { GetCommentForPostHandler } from '@features/posts/application/handlers/get-comment.handler';
import { GetCommentsForPostHandler } from '@features/posts/application/handlers/get-comments-for-post.handler';
import { GetAllPostsHandler } from '@features/posts/application/handlers/get-all-posts.handler';
import { Post, PostSchema } from '@features/posts/domain/post.entity';
import { BlogsModule } from '@features/blogs/blogs.module';
import { CommentsModule } from '@features/comments/comments.module';
import { PostsController } from '@features/posts/api/posts.controller';
import { GetPostHandler } from '@features/posts/application/handlers/get-post.handler';
import { Like, LikeSchema } from '@features/likes/domain/likes.entity';
import { User, UserSchema } from '@features/users/domain/user.entity';
import { UsersModule } from '@features/users/users.module';
import { IsBlogExistConstrain } from '@infrastructure/decorators/validate/is-blog-exist.decorator';

const postsProviders: Provider[] = [
  PostsRepository,
  PostsService,
  PostsQueryRepository,
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
  GetPostHandler,
  IsPostExistHandler,
  IsBlogExistCommand,
  GetCommentForPostHandler,
  GetCommentsForPostHandler,
  GetAllPostsHandler,
  IsBlogExistConstrain,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: User.name, schema: UserSchema },
    ]),
    SharedModule,
    forwardRef(() => BlogsModule),
    forwardRef(() => CommentsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [...postsProviders],
  controllers: [PostsController],
  exports: [PostsRepository, PostsQueryRepository],
})
export class PostsModule {}
