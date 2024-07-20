import { IsLogin } from '@infrastructure/decorators/validate/is-login';
import { isUserEmail } from '@infrastructure/decorators/validate/is-email';
import { IsPassword } from '@infrastructure/decorators/validate/is-password';

export class UserCreateModel {
  @IsLogin()
  login: string;

  @IsPassword()
  password: string;

  @isUserEmail()
  email: string;
}
