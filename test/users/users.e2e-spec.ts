import request from 'supertest';
import { createAuthorizationHeader } from '../test-helpers';
import { appSettings } from '@settings/app-settings';
import { app, mockUserModel } from '../jest.setup';
import { HttpStatus } from '@nestjs/common';
import { testSeeder } from '../test.seeder';
import { UserOutputDtoMapper } from '@features/users/api/dto/output/user.output.dto';

describe('Users (e2e)', () => {
  it('Should get empty users', async () => {
    const userList = await mockUserModel.insertMany(
      testSeeder.createUserListDto(1),
    );

    return request(app.getHttpServer())
      .get('/users')
      .set(
        createAuthorizationHeader(
          appSettings.api.ADMIN_AUTH_USERNAME,
          appSettings.api.ADMIN_AUTH_PASSWORD,
        ),
      )
      .expect(HttpStatus.OK)
      .expect({
        // экземпляр класса UserOutputDtoMapper преобразовываем в объект
        items: userList.map((user) => ({ ...UserOutputDtoMapper(user) })),
        totalCount: 1,
        pageSize: 10,
        page: 1,
        pagesCount: 1,
      });
  });
});
