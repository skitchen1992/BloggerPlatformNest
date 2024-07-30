import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from '@features/users/infrastructure/users.repository';
import { UsersService } from '@features/users/application/users.service';
import { UsersQueryRepository } from '@features/users/infrastructure/users.query-repository';
import { appSettings } from '@settings/app-settings';
import { User, UserSchema } from '@features/users/domain/user.entity';
import { UsersController } from '@features/users/api/users.controller';
import { LoggerMiddleware } from '@infrastructure/middlewares/logger.middleware';
import { HashBuilder } from '@utils/hash-builder';
import { Pagination } from '@base/models/pagination.base.model';
import { BlogsController } from '@features/blogs/api/blogs.controller';
import { BlogsService } from '@features/blogs/application/blogs.service';
import { BlogsRepository } from '@features/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from '@features/blogs/infrastructure/blogs.query-repository';
import { Blog, BlogSchema } from '@features/blogs/domain/blog.entity';
import { Post, PostSchema } from '@features/posts/domain/post.entity';
import { PostsController } from '@features/posts/api/posts.controller';
import { PostsRepository } from '@features/posts/infrastructure/posts.repository';
import { PostsService } from '@features/posts/application/posts.service';
import { PostsQueryRepository } from '@features/posts/infrastructure/posts.query-repository';
import {
  Comment,
  CommentSchema,
} from '@features/comments/domain/comment.entity';
import { CommentsRepository } from '@features/comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from '@features/comments/infrastructure/comments.query-repository';
import { CommentsService } from '@features/comments/application/comments.service';
import { CommentsController } from '@features/comments/api/comments.controller';
import { TestingController } from '@features/testing/api/testing.controller';
import { IsLoginExistConstrain } from '@infrastructure/decorators/validate/is-login-exist.decorator';
import { IsEmailExistConstrain } from '@infrastructure/decorators/validate/is-email-exist.decorator';
import { AuthController } from '@features/auth/api/auth.controller';
import { AuthService } from '@features/auth/application/auth.service';
import { NodeMailer } from '@infrastructure/servises/nodemailer/nodemailer.service';
import {
  Session,
  SessionSchema,
} from '@features/session/domain/session.entity';
import { JwtService } from '@infrastructure/servises/jwt/jwt.service';

const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
];

const blogsProviders: Provider[] = [
  BlogsRepository,
  BlogsQueryRepository,
  BlogsService,
];

const postsProviders: Provider[] = [
  PostsRepository,
  PostsService,
  PostsQueryRepository,
];

const commentsProviders: Provider[] = [
  CommentsRepository,
  CommentsQueryRepository,
  CommentsService,
];

const basesProviders: Provider[] = [
  HashBuilder,
  Pagination,
  JwtService,
  NodeMailer,
];

const authProviders: Provider[] = [AuthService];

@Module({
  // Регистрация модулей
  imports: [
    MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  // Регистрация провайдеров
  providers: [
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commentsProviders,
    ...authProviders,
    ...basesProviders,
    IsLoginExistConstrain,
    IsEmailExistConstrain,
  ],
  // Регистрация контроллеров
  controllers: [
    UsersController,
    BlogsController,
    PostsController,
    CommentsController,
    TestingController,
    AuthController,
  ],
})
export class AppModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
