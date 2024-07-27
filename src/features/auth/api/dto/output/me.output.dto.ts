export class MeOutputDto {
  login: string;
  email: string;
  userId: string;
}

// MAPPERS

export const MeOutputDtoMapper = (user: any): MeOutputDto => {
  const outputDto = new MeOutputDto();

  outputDto.login = user.login;
  outputDto.email = user.email;
  outputDto.userId = user.userId;

  return outputDto;
};
