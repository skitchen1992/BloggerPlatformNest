import { forwardRef, Module, Provider } from '@nestjs/common';
import { SharedModule } from '../../modules/shared.module';
import { AuthService } from '@features/auth/application/auth.service';
import { LoginHandler } from '@features/auth/application/handlers/login.handler';
import { RegistrationConfirmationHandler } from '@features/auth/application/handlers/registration-confirmation.handler';
import { RegistrationHandler } from '@features/auth/application/handlers/registration.handler';
import { RegistrationEmailResendingHandler } from '@features/auth/application/handlers/registration-email-resending.handler';
import { PasswordRecoveryHandler } from '@features/auth/application/handlers/passport-recovery.handler';
import { NewPassportHandler } from '@features/auth/application/handlers/new-passport.handler';
import { GetMeHandler } from '@features/auth/application/handlers/get-me.handler';
import { AuthController } from '@features/auth/api/auth.controller';
import { UsersModule } from '@features/users/users.module';

const authProviders: Provider[] = [
  AuthService,
  LoginHandler,
  RegistrationConfirmationHandler,
  RegistrationHandler,
  RegistrationEmailResendingHandler,
  PasswordRecoveryHandler,
  NewPassportHandler,
  GetMeHandler,
];

@Module({
  imports: [SharedModule, forwardRef(() => UsersModule)],
  providers: [...authProviders],
  controllers: [AuthController],
})
export class AuthModule {}
