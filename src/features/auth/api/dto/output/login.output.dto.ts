import { UserDocument } from '@features/users/domain/user.entity';

export class LoginOutputDto {
  accessToken: string;
}

// MAPPERS

export const LoginOutputDtoMapper = (user: UserDocument): LoginOutputDto => {
  const outputDto = new LoginOutputDto();

  outputDto.accessToken = user.login;

  return outputDto;
};
