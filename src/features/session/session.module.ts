import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Session,
  SessionSchema,
} from '@features/session/domain/session.entity';
import { SessionsRepository } from '@features/session/infrastructure/sessions.repository';
import { SessionsQueryRepository } from '@features/session/infrastructure/sessions.query-repository';
import { SessionController } from '@features/session/api/session.controller';
import { SharedModule } from '../../modules/shared.module';
import { GetAllDevicesHandler } from '@features/session/application/handlers/get-all-devices.handler';
import { DeleteAllDevicesHandler } from '@features/session/application/handlers/delete-all-devices.handler';
import { DeleteDeviceHandler } from '@features/session/application/handlers/delete-device.handler';

const sessionProviders: Provider[] = [
  SessionsRepository,
  SessionsQueryRepository,
  GetAllDevicesHandler,
  DeleteAllDevicesHandler,
  DeleteDeviceHandler,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    SharedModule,
  ],
  providers: [...sessionProviders],
  controllers: [SessionController],
  exports: [SessionsRepository, SessionsQueryRepository],
})
export class SessionModule {}
