import { IsLoginDecorator } from '@infrastructure/decorators/validate/is-login.decorator';
import { isUserEmail } from '@infrastructure/decorators/validate/is-email.decorator';
import { IsPasswordDecorator } from '@infrastructure/decorators/validate/is-password.decorator';

export class RegistrationUserDto {
  @IsLoginDecorator()
  login: string;

  @IsPasswordDecorator()
  password: string;

  @isUserEmail()
  email: string;
}
