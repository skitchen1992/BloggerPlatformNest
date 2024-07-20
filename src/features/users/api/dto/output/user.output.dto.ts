import { UserDocument } from '../../../domain/user.entity';

export class UserOutputDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

// MAPPERS

export const UserOutputDtoMapper = (user: UserDocument): UserOutputDto => {
  const outputModel = new UserOutputDto();

  outputModel.id = user._id.toString();
  outputModel.login = user.login;
  outputModel.email = user.email;
  outputModel.createdAt = user.createdAt.toISOString();

  return outputModel;
};
