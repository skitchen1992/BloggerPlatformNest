import { UserDocument } from '@features/users/domain/user.entity';

export class MeOutputDto {
  login: string;
  email: string;
  userId: string;
}

// MAPPERS

export const MeOutputDtoMapper = (user: UserDocument): MeOutputDto => {
  const outputDto = new MeOutputDto();

  outputDto.login = user.login;
  outputDto.email = user.email;
  outputDto.userId = user._id.toString();

  return outputDto;
};
