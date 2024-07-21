import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export interface ICommentatorInfo {
  userId: string;
  userLogin: string;
}
@Schema()
export class Comment {
  @Prop({ type: String, require: true, minlength: 20, maxlength: 300 })
  content: string;

  @Prop({
    type: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
    required: true,
  })
  commentatorInfo: ICommentatorInfo;

  @Prop({ type: String, require: true })
  postId: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
//Для загрузки статических методов
CommentSchema.loadClass(Comment);

//Types
export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument>;
