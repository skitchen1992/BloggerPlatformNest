import { forwardRef, Module, Provider } from '@nestjs/common';
import { HashBuilder } from '@utils/hash-builder';
import { Pagination } from '@base/models/pagination.base.model';
import { NodeMailer } from '@infrastructure/servises/nodemailer/nodemailer.service';
import { BasicStrategy } from '@infrastructure/strategies/basic.strategy';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';
import { UsersModule } from '@features/users/users.module';
import { IsLoginExistConstrain } from '@infrastructure/decorators/validate/is-login-exist.decorator';
import { IsEmailExistConstrain } from '@infrastructure/decorators/validate/is-email-exist.decorator';

const basesProviders: Provider[] = [
  HashBuilder,
  Pagination,
  NodeMailer,
  BasicStrategy,
  JwtStrategy,
  IsLoginExistConstrain,
  IsEmailExistConstrain,
];
@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [...basesProviders],
  exports: [...basesProviders],
})
export class SharedModule {}
