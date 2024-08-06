import { forwardRef, Module } from '@nestjs/common';
import { HashBuilder } from '@utils/hash-builder';
import { Pagination } from '@base/models/pagination.base.model';
import { NodeMailer } from '@infrastructure/servises/nodemailer/nodemailer.service';
import { BasicStrategy } from '@infrastructure/strategies/basic.strategy';
import { JwtStrategy } from '@infrastructure/strategies/jwt.strategy';
import { UsersModule } from '@features/users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [HashBuilder, Pagination, NodeMailer, BasicStrategy, JwtStrategy],
  exports: [HashBuilder, Pagination, NodeMailer, BasicStrategy, JwtStrategy],
})
export class SharedModule {}
