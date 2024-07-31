import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '@features/users/domain/user.entity';
import { UsersRepository } from '@features/users/infrastructure/users.repository';

let mongoDB: MongoMemoryServer;
export let app: INestApplication;

export let mockUserModel: Model<UserDocument>;

beforeAll(async () => {
  mongoDB = await MongoMemoryServer.create({ instance: { port: 3001 } });

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      MongooseModule.forRootAsync({
        useFactory: async () => ({
          uri: mongoDB.getUri(),
        }),
      }),
      AppModule,
    ],
    providers: [
      {
        provide: getModelToken(User.name),
        useValue: Model,
      },
      UsersRepository,
    ],
  }).compile();

  mockUserModel = moduleFixture.get<Model<UserDocument>>(
    getModelToken(User.name),
  );

  app = moduleFixture.createNestApplication();
  await app.init();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoDB.stop();
  await app.close();
});
