import { Trim } from '@infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PostUpdateDto {
  @Trim()
  @IsString({ message: 'Title must be a string' })
  @Length(1, 30, { message: 'Title must be between 1 and 30 characters' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @Trim()
  @IsString({ message: 'Description must be a string' })
  @Length(1, 100, {
    message: 'ShortDescription must be between 1 and 100 characters',
  })
  @IsNotEmpty({ message: 'ShortDescription is required' })
  shortDescription: string;

  @Trim()
  @IsString({ message: 'Content must be a string' })
  @Length(1, 1000, {
    message: 'Content must be between 1 and 1000 characters',
  })
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @Trim()
  @IsString({ message: 'BlogId must be a string' })
  @IsNotEmpty({ message: 'BlogId is required' })
  blogId: string;
}
