import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { BlogUpdateDto } from '@features/blogs/api/dto/input/update-blog.input.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  public async create(newBlog: Blog): Promise<string> {
    const insertResult = await this.blogModel.insertMany([newBlog]);

    return insertResult[0].id;
  }

  public async update(id: string, data: BlogUpdateDto): Promise<boolean> {
    const updateResult = await this.blogModel.updateOne({ _id: id }, data);

    return updateResult.modifiedCount === 1;
  }

  public async delete(id: string): Promise<boolean> {
    const deleteResult = await this.blogModel.deleteOne({ _id: id });

    return deleteResult.deletedCount === 1;
  }
}
