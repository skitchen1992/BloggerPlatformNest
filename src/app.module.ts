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
import { HashBuilder } from '@utils/hash.builder';
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

const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
  HashBuilder,
  Pagination,
];

const blogsProviders: Provider[] = [
  BlogsRepository,
  BlogsQueryRepository,
  PostsQueryRepository,
  BlogsService,
  PostsService,
  Pagination,
];

const postsProviders: Provider[] = [
  PostsRepository,
  PostsService,
  PostsQueryRepository,
  BlogsQueryRepository,
  Pagination,
];

@Module({
  // Регистрация модулей
  imports: [
    MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  // Регистрация провайдеров
  providers: [...usersProviders, ...blogsProviders, ...postsProviders],
  // Регистрация контроллеров
  controllers: [UsersController, BlogsController, PostsController],
})
export class AppModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
