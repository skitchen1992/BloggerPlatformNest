import { IsPasswordDecorator } from '@infrastructure/decorators/validate/is-password.decorator';
import { Trim } from '@infrastructure/decorators/transform/trim';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @Trim()
  @IsNotEmpty({ message: 'LoginOrEmail is required' })
  loginOrEmail: string;

  @IsPasswordDecorator()
  password: string;
}
