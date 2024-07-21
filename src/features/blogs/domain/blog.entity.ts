import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class Blog {
  @Prop({ type: String, require: true, maxlength: 15 })
  name: string;

  @Prop({ type: String, require: true, maxlength: 500 })
  description: string;

  @Prop({ type: String, require: true, maxlength: 100 })
  websiteUrl: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Boolean, require: true })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
//Для загрузки статических методов
BlogSchema.loadClass(Blog);

//Types
export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument>;
