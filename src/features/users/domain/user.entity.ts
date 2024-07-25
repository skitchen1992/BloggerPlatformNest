import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

interface IEmailConfirmation {
  isConfirmed: boolean;
  confirmationCode: string;
  expirationDate: Date;
}
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

  @Prop({
    type: {
      isConfirmed: { type: Boolean, default: false },
      confirmationCode: { type: String, required: true },
      expirationDate: { type: Date, required: true },
    },
    required: false,
  })
  emailConfirmation?: IEmailConfirmation;
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
