import { Trim } from '@infrastructure/decorators/transform/trim';
import { IsString } from 'class-validator';

export class RegistrationConfirmationDto {
  @Trim()
  @IsString({ message: 'Code must be a string' })
  code: string;
}
