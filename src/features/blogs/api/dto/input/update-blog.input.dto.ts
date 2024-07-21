import { Trim } from '@infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class BlogUpdateDto {
  @Trim()
  @IsString({ message: 'Name must be a string' })
  @Length(1, 15, { message: 'Name must be between 1 and 15 characters' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Trim()
  @IsString({ message: 'Description must be a string' })
  @Length(1, 500, {
    message: 'Description must be between 1 and 500 characters',
  })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @Trim()
  @IsString({ message: 'WebsiteUrl must be a string' })
  @Length(1, 100, {
    message: 'WebsiteUrl must be between 1 and 100 characters',
  })
  @IsNotEmpty({ message: 'WebsiteUrl is required' })
  websiteUrl: string;
}
