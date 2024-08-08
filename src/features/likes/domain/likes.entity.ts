import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export enum LikeStatusEnum {
  LIKE = 'Like',
  DISLIKE = 'Dislike',
  NONE = 'None',
}

export enum ParentTypeEnum {
  POST = 'Post',
  COMMENT = 'Comment',
}
@Schema()
export class Like {
  @Prop({ type: String, require: true })
  createdAt: Date;

  @Prop({
    type: String,
    require: true,
    enum: Object.values(LikeStatusEnum),
    required: true,
  })
  status: string;

  @Prop({ type: String, require: true })
  authorId: string;

  @Prop({ type: String, require: true })
  parentId: string;

  @Prop({ type: String, enum: Object.values(ParentTypeEnum), required: true })
  parentType: string;
}

export const LikesSchema = SchemaFactory.createForClass(Like);
//Для загрузки статических методов
LikesSchema.loadClass(Like);

//Types
export type LikesDocument = HydratedDocument<Like>;

export type LikesModelType = Model<LikesDocument>;
