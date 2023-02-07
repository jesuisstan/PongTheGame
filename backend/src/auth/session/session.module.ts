import { Module } from '@nestjs/common';
import { SessionSerializer } from '../../auth/session/session.serializer';
import { SessionService } from '../../auth/session/session.service';
import { UserModule } from '../../user/user.module';

@Module({
  providers: [SessionSerializer, SessionService],
  imports: [UserModule],
  exports: [SessionService],
})
export class SessionModule {}
