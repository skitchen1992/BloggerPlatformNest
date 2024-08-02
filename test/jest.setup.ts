import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '@features/users/domain/user.entity';
import { applyAppSettings } from '@settings/apply-app-setting';

let mongoDB: MongoMemoryServer;
export let app: INestApplication;
export let mockUserModel: Model<UserDocument>;

beforeAll(async () => {
  mongoDB = await MongoMemoryServer.create();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
      MongooseModule.forRootAsync({
        useFactory: async () => ({
          uri: mongoDB.getUri(),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
      }),
    ],
  }).compile();

  mockUserModel = moduleFixture.get<Model<UserDocument>>(
    getModelToken(User.name),
  );

  app = moduleFixture.createNestApplication();

  applyAppSettings(app);

  await app.init();
});

beforeEach(async () => {
  await mockUserModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoDB.stop();
  await app.close();
});
