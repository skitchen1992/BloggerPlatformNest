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
import { BasicStrategy } from '@infrastructure/strategies/basic.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, {
  ConfigurationType,
  validate,
} from '@settings/configuration';
import { EnvironmentsEnum } from '@settings/env-settings';
import { CreateUserHandler } from '@features/users/application/handlers/create-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteUserHandler } from '@features/users/application/handlers/delete-user.handler';
import { LoginHandler } from '@features/auth/application/handlers/login.handler';
import { PasswordRecoveryHandler } from '@features/auth/application/handlers/passport-recovery.handler';
import { NewPassportHandler } from '@features/auth/application/handlers/new-passport.handler';
import { RegistrationConfirmationHandler } from '@features/auth/application/handlers/registration-confirmation.handler';

const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
  CreateUserHandler,
  DeleteUserHandler,
  RegistrationConfirmationHandler,
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
  NodeMailer,
  BasicStrategy,
  JwtStrategy,
];

const authProviders: Provider[] = [
  AuthService,
  LoginHandler,
  PasswordRecoveryHandler,
  NewPassportHandler,
];

@Module({
  // Регистрация модулей
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      envFilePath: ['.env'],
      ignoreEnvFile:
        process.env.ENV !== EnvironmentsEnum.DEVELOPMENT &&
        process.env.ENV !== EnvironmentsEnum.TESTING,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<ConfigurationType, true>) => {
        const apiSettings = configService.get('apiSettings', { infer: true });

        return {
          uri: apiSettings.MONGO_CONNECTION_URI,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (
        configService: ConfigService<ConfigurationType, true>,
      ) => {
        const apiSettings = configService.get('apiSettings', { infer: true });

        return {
          secret: apiSettings.JWT_SECRET_KEY,
          signOptions: { expiresIn: apiSettings.ACCESS_TOKEN_EXPIRED_IN },
        };
      },
      inject: [ConfigService],
    }),
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
