import { isEmail } from '@infrastructure/decorators/validate/is-email.decorator';

export class RegistrationEmailResendingDto {
  @isEmail()
  email: string;
}
