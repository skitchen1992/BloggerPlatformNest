import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from '@infrastructure/middlewares/logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, {
  ConfigurationType,
  validate,
} from '@settings/configuration';
import { EnvironmentsEnum } from '@settings/env-settings';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '@features/users/users.module';
import { SharedModule } from './shared.module';
import { AuthModule } from '@features/auth/auth.module';
import { BlogsModule } from '@features/blogs/blogs.module';
import { PostsModule } from '@features/posts/posts.module';
import { CommentsModule } from '@features/comments/comments.module';
import { TestingModule } from '@features/testing/testing.module';
import { LikesModule } from '@features/likes/likes.module';
import { SessionModule } from '@features/session/session.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  // Регистрация модулей
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      envFilePath: ['.env'],
      ignoreEnvFile:
        process.env.ENV !== EnvironmentsEnum.DEVELOPMENT &&
        process.env.ENV !== EnvironmentsEnum.TESTING,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigurationType, true>) => {
        const apiSettings = configService.get('apiSettings', { infer: true });

        return [
          {
            ttl: Number(apiSettings.THROTTLER_TTL),
            limit: Number(apiSettings.THROTTLER_LIMIT),
          },
        ];
      },
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
    UsersModule,
    AuthModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    SharedModule,
    SessionModule,
    TestingModule,
  ],
  // Регистрация провайдеров
  providers: [],
  // Регистрация контроллеров
  controllers: [],
})
export class AppModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
