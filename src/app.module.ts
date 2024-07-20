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

const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
  HashBuilder,
  Pagination,
];

const blogsProviders: Provider[] = [
  BlogsRepository,
  BlogsService,
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
    ]),
  ],
  // Регистрация провайдеров
  providers: [...usersProviders, ...blogsProviders],
  // Регистрация контроллеров
  controllers: [UsersController, BlogsController],
})
export class AppModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
