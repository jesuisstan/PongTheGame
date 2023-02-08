import { Module } from '@nestjs/common';
import { SessionSerializer } from 'src/auth/session/session.serializer';
import { SessionService } from 'src/auth/session/session.service';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [SessionSerializer, SessionService],
  imports: [UserModule],
  exports: [SessionService],
})
export class SessionModule {}
