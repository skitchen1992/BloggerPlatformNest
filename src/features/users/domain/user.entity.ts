import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class User {
  @Prop({ type: String, require: true, minlength: 3, maxlength: 10 })
  login: string;

  @Prop({ type: String, require: true })
  password: string;

  @Prop({ type: String, require: true })
  email: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
//Для загрузки статических методов
UserSchema.loadClass(User);

//Types
export type UserDocument = HydratedDocument<User>;

// type UserModelStaticType = {
//   createUser: (name: string, email: string) => UserDocument;
// };

export type UserModelType = Model<UserDocument>; // & UserModelStaticType;
