import { Trim } from '@infrastructure/decorators/transform/trim';
import { IsPasswordDecorator } from '@infrastructure/decorators/validate/is-password.decorator';
import { IsString } from 'class-validator';

export class NewPasswordDto {
  @IsPasswordDecorator()
  newPassword: string;

  @Trim()
  @IsString({ message: 'RecoveryCode must be a string' })
  recoveryCode: string;
}
